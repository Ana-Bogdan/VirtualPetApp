"""
Database models and utilities for storing conversations and user data.
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

Base = declarative_base()

# Database file path
DB_PATH = "virtual_pet.db"

# Create engine
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class User(Base):
    """User model for storing user profiles"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    user_name = Column(String, nullable=False)
    pet_name = Column(String, nullable=False, default="Nori")
    vibe_score = Column(Float, default=50.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    """Conversation model for storing chat sessions"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")


class Message(Base):
    """Message model for storing individual chat messages"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender = Column(String, nullable=False)  # 'user' or 'pet'
    content = Column(Text, nullable=False)
    detected_emotion = Column(String, nullable=True)
    vibe_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


def init_db():
    """Initialize the database and create tables"""
    Base.metadata.create_all(bind=engine)
    print(f"✅ Database initialized at {DB_PATH}")


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Database utility functions
class DatabaseManager:
    """Manager class for database operations"""
    
    @staticmethod
    def get_or_create_user(db, user_id: str, user_name: str = None, pet_name: str = "Nori"):
        """Get existing user or create new one"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            user = User(
                user_id=user_id,
                user_name=user_name or user_id.capitalize(),
                pet_name=pet_name,
                vibe_score=50.0
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    @staticmethod
    def update_user_vibe_score(db, user_id: str, vibe_score: float):
        """Update user's vibe score"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if user:
            user.vibe_score = vibe_score
            user.updated_at = datetime.utcnow()
            db.commit()
            return user
        return None
    
    @staticmethod
    def get_or_create_conversation(db, user_id: str, session_id: str = None):
        """Get or create conversation for a user"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return None
        
        # Use user_id as session_id if not provided
        session_id = session_id or user_id
        
        # Get the most recent conversation or create new one
        conversation = db.query(Conversation).filter(
            Conversation.user_id == user.id,
            Conversation.session_id == session_id
        ).first()
        
        if not conversation:
            conversation = Conversation(
                user_id=user.id,
                session_id=session_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        
        return conversation
    
    @staticmethod
    def save_message(db, conversation_id: int, sender: str, content: str, 
                    detected_emotion: str = None, vibe_score: float = None):
        """Save a message to the database"""
        message = Message(
            conversation_id=conversation_id,
            sender=sender,
            content=content,
            detected_emotion=detected_emotion,
            vibe_score=vibe_score
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    
    @staticmethod
    def get_conversation_history(db, user_id: str, limit: int = 100):
        """Get conversation history for a user"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return []
        
        # Get the most recent conversation
        conversation = db.query(Conversation).filter(
            Conversation.user_id == user.id
        ).order_by(Conversation.updated_at.desc()).first()
        
        if not conversation:
            return []
        
        # Get messages ordered by creation time
        messages = db.query(Message).filter(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.asc()).limit(limit).all()
        
        return [
            {
                "id": msg.id,
                "sender": msg.sender,
                "text": msg.content,
                "emotionalState": msg.detected_emotion,
                "timestamp": msg.created_at.isoformat() if msg.created_at else None
            }
            for msg in messages
        ]
    
    @staticmethod
    def get_user_profile(db, user_id: str):
        """Get user profile information"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return None
        
        return {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "pet_name": user.pet_name,
            "vibe_score": user.vibe_score,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }


# Initialize database on import
if not os.path.exists(DB_PATH):
    init_db()
