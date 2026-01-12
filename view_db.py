"""
Simple script to view and explore the database contents.
Run with: python view_db.py
"""
from database import SessionLocal, User, Conversation, Message
from sqlalchemy import func

def view_database():
    """Display database contents in a readable format"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("📊 VIRTUAL PET APP DATABASE VIEWER")
        print("=" * 60)
        
        # Get all users
        users = db.query(User).all()
        print(f"\n👥 USERS ({len(users)} total):")
        print("-" * 60)
        for user in users:
            print(f"  • {user.user_name} (ID: {user.user_id})")
            print(f"    Pet: {user.pet_name} | Vibe Score: {user.vibe_score:.1f}")
            print(f"    Created: {user.created_at}")
            print()
        
        # Get all conversations
        conversations = db.query(Conversation).all()
        print(f"\n💬 CONVERSATIONS ({len(conversations)} total):")
        print("-" * 60)
        for conv in conversations:
            user = db.query(User).filter(User.id == conv.user_id).first()
            message_count = db.query(Message).filter(Message.conversation_id == conv.id).count()
            print(f"  • Session: {conv.session_id}")
            print(f"    User: {user.user_name if user else 'Unknown'}")
            print(f"    Messages: {message_count}")
            print(f"    Last updated: {conv.updated_at}")
            print()
        
        # Get message statistics
        total_messages = db.query(Message).count()
        user_messages = db.query(Message).filter(Message.sender == 'user').count()
        pet_messages = db.query(Message).filter(Message.sender == 'pet').count()
        
        print(f"\n📨 MESSAGES ({total_messages} total):")
        print("-" * 60)
        print(f"  • User messages: {user_messages}")
        print(f"  • Pet messages: {pet_messages}")
        
        # Show recent messages
        recent_messages = db.query(Message).order_by(Message.created_at.desc()).limit(10).all()
        if recent_messages:
            print(f"\n📝 RECENT MESSAGES (last 10):")
            print("-" * 60)
            for msg in reversed(recent_messages):
                conv = db.query(Conversation).filter(Conversation.id == msg.conversation_id).first()
                user = db.query(User).filter(User.id == conv.user_id).first() if conv else None
                sender_name = user.user_name if user and msg.sender == 'user' else 'Pet'
                print(f"  [{msg.created_at.strftime('%Y-%m-%d %H:%M')}] {sender_name}: {msg.content[:60]}...")
                if msg.detected_emotion:
                    print(f"    Emotion: {msg.detected_emotion}")
        
        print("\n" + "=" * 60)
        print("✅ Database view complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error viewing database: {e}")
    finally:
        db.close()


def query_user_conversation(user_id: str):
    """View conversation for a specific user"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            print(f"❌ User '{user_id}' not found")
            return
        
        print(f"\n👤 USER: {user.user_name} ({user.user_id})")
        print(f"   Pet: {user.pet_name} | Vibe: {user.vibe_score:.1f}")
        print("-" * 60)
        
        conversation = db.query(Conversation).filter(
            Conversation.user_id == user.id
        ).order_by(Conversation.updated_at.desc()).first()
        
        if not conversation:
            print("   No conversations found")
            return
        
        messages = db.query(Message).filter(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.asc()).all()
        
        print(f"\n💬 CONVERSATION ({len(messages)} messages):\n")
        for msg in messages:
            sender_icon = "👤" if msg.sender == 'user' else "🐾"
            print(f"{sender_icon} {msg.sender.upper()}: {msg.content}")
            if msg.detected_emotion:
                print(f"   [Emotion: {msg.detected_emotion}]")
            print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # View specific user conversation
        user_id = sys.argv[1]
        query_user_conversation(user_id)
    else:
        # View all database contents
        view_database()
        
        print("\n💡 TIP: To view a specific user's conversation, run:")
        print("   python view_db.py <user_id>")
        print("   Example: python view_db.py demo")
