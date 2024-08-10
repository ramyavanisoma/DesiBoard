import os 
from flask import Flask, request, jsonify, render_template, send_from_directory
import pyodbc
from flask_cors import CORS
from datetime import datetime
import re
import time

app = Flask(__name__, static_folder='templates', template_folder='templates')

CORS(app) 

# Azure SQL Database connection details
server = os.getenv('DB_SERVER', 'desiboardserver.database.windows.net')
database = os.getenv('DB_NAME', 'WeDesiDB')
username = os.getenv('DB_USERNAME', 'dbadmin')
password = os.getenv('DB_PASSWORD', 'Desiboard1234')
driver = '{ODBC Driver 17 for SQL Server}'


def get_db_connection():
    connection_string = f'DRIVER={driver};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}'
    return pyodbc.connect(connection_string)


# # Function to add a thread
# def add_thread(author, title, content):
#     command = 'INSERT INTO threads (author, title, content, likes) VALUES (?, ?, ?, 0)'
#     values = (author, title, content)
#     cursor.execute(command, values)
#     cnxn.commit()


# # Function to add a comment
# def add_comment(thread_id, author, content):
#     insert_command = 'INSERT INTO comments (threadID, author, content) VALUES (?, ?, ?)'
#     insert_values = (thread_id, author, content)
#     cursor.execute(insert_command, insert_values)
#     cnxn.commit()
#     update_command = 'UPDATE threads SET comment_count = comment_count + 1 WHERE id = ?'
#     update_values = (thread_id,)
#     cursor.execute(update_command, update_values)
#     cnxn.commit()
#     return show_thread(thread_id)


# # Function to show all threads
# def show_all_threads():
#     command = 'SELECT * FROM threads ORDER BY creationDate DESC'
#     cursor.execute(command)
#     result = cursor.fetchall()
#     threads = {}
#     for thread in result:
#         threads[thread[0]] = {
#             'user': thread[1],
#             'title': thread[4],
#             'creationDate': thread[2],
#             'content': thread[3],
#             'comments': thread[5],
#             'likes': thread[6]  # Assuming likes is the 7th column
#         }
#     return threads 


# # Function to show a specific thread
# def show_thread(thread_id):
#     thread_command = 'SELECT * FROM threads WHERE id = ?'
#     comment_command = 'SELECT * FROM comments WHERE threadID = ? ORDER BY creationDate DESC'
#     thread_value = (thread_id,)
#     comment_value = (thread_id,)
#     cursor.execute(thread_command, thread_value)
#     thread_result = cursor.fetchone()
#     cursor.execute(comment_command, comment_value)
#     comment_result = cursor.fetchall()
#     comments = {}
#     for comment in comment_result:
#         comments[comment[0]] = {
#             'threadID': comment[1],
#             'user': comment[2],
#             'creationDate': comment[3],
#             'content': comment[4]
#         }
#     thread = {
#         'id': thread_id,
#         'user': thread_result[1],
#         'title': thread_result[4],
#         'creationDate': thread_result[2],
#         'content': thread_result[3],
#         'comment_count': thread_result[5],
#         'likes': thread_result[6],
#         'comments': comments
#     }
#     return thread


# # Function to add an account
# def add_account(username, password):
#     command = 'INSERT INTO accounts (userName, userPassword) VALUES (?, ?)'
#     values = (username, password)
#     cursor.execute(command, values)
#     cnxn.commit()



# # Function to add a question
# def add_question(author, title, content, num_answers, num_likes):
#     command = 'INSERT INTO questions (author, title, content, num_answers, num_likes) VALUES (?, ?, ?, ?, ?)'
#     values = (author, title, content, num_answers, num_likes)
#     cursor.execute(command, values)
#     cnxn.commit()


# # Function to like a thread
# def like_thread(thread_id):
#     update_command = 'UPDATE threads SET likes = likes + 1 WHERE id = ?'
#     update_values = (thread_id,)
#     cursor.execute(update_command, update_values)
#     cnxn.commit()
#     return show_thread(thread_id)


# # Route to serve static files
# @app.route('/<path:path>', methods=['GET'])
# def static_proxy(path):
#     return send_from_directory('/mnt/data/WeDesi', path)


# Route for the login
@app.route('/')
def login():
    return render_template('index.html')

# Route for the signup
@app.route('/signup')
def signup():
    return render_template('signup.html')

# Route for the homepage
@app.route('/homePage')
def home():
    return render_template('homePage.html')

# Route for the questionDetails page
@app.route('/questionDetails')
def questionDetails():
    return render_template('questionDetails.html')

# Route for the aboutUs
@app.route('/aboutUs')
def aboutUs():
    return render_template('aboutUs.html')

# Route for the EmergencyInfo
@app.route('/emergency')
def emergencyInfo():
    return render_template('emergency.html')

# Route for the healthInfo
@app.route('/health')
def healthInfo():
    return render_template('health.html')

# Route for the creditInfo
@app.route('/credit')
def creditInfo():
    return render_template('credit.html')

# Route for the visaInfo
@app.route('/visa')
def visaInfo():
    return render_template('visa.html')

# Route for the legalInfo
@app.route('/legal')
def legalInfo():
    return render_template('legal.html')

# Route for the legalInfo
@app.route('/scheduleAppointment')
def scheduleAppointment():
    return render_template('scheduleAppointment.html')




#API endpoint for login
@app.route('/api/login', methods=['POST'])
def loginAction():
    data = request.get_json()  # Get JSON data from request body
    username = data.get('username')
    password = data.get('password')
    command = 'SELECT TOP 1 * FROM Users WHERE email = ? AND password_hash = ?'
    values = (username, password)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(command, values)
    row = cursor.fetchone()
    print(row)
    if row:
        user = dict(zip([column[0] for column in cursor.description], row))
        # result = {'success': 'success', 'user': user}
        return jsonify(success=True, user=user)
    else:
        return jsonify(success=False, message='Invalid credentials'), 401
    

@app.route('/api/signup', methods=['POST'])
def signupAction():
    data = request.get_json()

    print(data)

    role = data.get('role')
    category = data.get('category')
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')

    # Validate password
    password_regex = re.compile(r'^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d).{5,10}$')
    if not password_regex.match(password):
        return jsonify({'success': False, 'message': 'Password must be between 5 and 10 characters long, contain at least one uppercase letter, and one alphanumeric character.'}), 400

    # Check if all required fields are filled
    if role == 'expert' and not category:
        return jsonify({'success': False, 'message': 'Please select a category.'}), 400
    if role != 'expert' and not all([name, email, phone]):
        return jsonify({'success': False, 'message': 'Please fill out all required fields.'}), 400

    # Hash the password
    password_hash = password

    # Get current timestamp
    created_at_unix = time.time()

    # Convert Unix timestamp to SQL DATETIME format (ISO 8601)
    created_at_sql = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(created_at_unix))

    # Database operations
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if role == 'expert':
            # Check if email already exists for experts
            cursor.execute("SELECT COUNT(*) FROM experts WHERE email = ?", (email))
            email_exists = cursor.fetchone()[0] > 0
            if email_exists:
                return jsonify({'success': False, 'message': 'Email already exists for expert.'}), 400

            # Insert into experts table
            cursor.execute("""
                INSERT INTO experts (expert_name, email, password_hash, created_at, category)
                VALUES (?, ?, ?, ?, ?)
            """, (name, email, password_hash, created_at_sql, category))
        else:
            print("entering user")
            # Check if email already exists for users
            cursor.execute("SELECT COUNT(*) FROM users WHERE email = ?", (email))
            email_exists = cursor.fetchone()[0] > 0
            if email_exists:
                return jsonify({'success': False, 'message': 'Email already exists for user.'}), 400

            print("inserting user")
            # Insert into users table
            cursor.execute("""
                INSERT INTO users (user_name, password_hash, email, created_at, address, subscription)
                VALUES (?, ?, ?, ?, ?,?)
            """, (name, password_hash, email, created_at_sql, address, "free"))
        
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'User created successfully.', 'username': name}), 201

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/search', methods=['POST'])
def search_questions():
    data = request.get_json()
    search_input = data.get('search_input')

    if not search_input:
        return jsonify({'success': False, 'message': 'Search input is required.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Search questions and join with users table
        cursor.execute("""
            SELECT q.question_id, q.title, q.description, q.created_at, u.user_name AS author_name
            FROM questions q
            INNER JOIN users u ON q.author_id = u.user_id
            WHERE q.title LIKE ? OR q.description LIKE ?
        """, ('%' + search_input + '%', '%' + search_input + '%'))

        results = cursor.fetchall()
        questions = [
            {
                'question_id': row[0],
                'title': row[1],
                'description': row[2],
                'created_at': row[3].strftime('%Y-%m-%d %H:%M:%S'),  # Format datetime to string
                'author_name': row[4]
            }
            for row in results
        ]

        cursor.close()
        conn.close()

        return jsonify({'success': True, 'questions': questions}), 200

    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/add-question', methods=['POST'])
def add_question():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    author_id = data.get('author_id')

    if not all([title, description, author_id]):
        return jsonify({'success': False, 'message': 'Title, description, and author ID are required.'}), 400

    # Get current timestamp (Unix time)
    created_at_unix = time.time()
    created_at_sql = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(created_at_unix))

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO questions (title, description, created_at, author_id)
            VALUES (?, ?, ?, ?)
        """, (title, description, created_at_sql, author_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'Question added successfully.'}), 201

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/get-answers', methods=['POST'])
def get_answers():
    data = request.get_json()
    question_id = data.get('question_id')

    print(data)

    if not question_id:
        return jsonify({'success': False, 'message': 'Question ID is required.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Query answers and join with users table
        cursor.execute("""
            SELECT u.user_name AS author_name, a.created_at, a.content, a.num_votes, a.answer_id
            FROM answers a
            INNER JOIN users u ON a.author_id = u.user_id
            WHERE a.question_id = ?
        """, (question_id))

        results = cursor.fetchall()

        print(results)

        answers = [
            {
                'author_name': row[0],
                'created_at': row[1].strftime('%Y-%m-%d %H:%M:%S'),  # Format datetime to string
                'description': row[2],
                'like_count': row[3],
                'answer_id': row[4]
            }
            for row in results
        ]

        cursor.close()
        conn.close()
        print(answers)
        return jsonify({'success': True, 'answers': answers}), 200

    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 500



@app.route('/api/recent-questions', methods=['GET'])
def get_recent_questions():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT TOP 10 q.question_id, q.title, q.description, q.created_at, u.user_name as author_name
    FROM questions q
    JOIN users u ON q.author_id = u.user_id
    ORDER BY q.created_at DESC
    """
    
    cursor.execute(query)
    rows = cursor.fetchall()
    
    questions = []
    for row in rows:
        question = {
            'question_id': row.question_id,
            'title': row.title,
            'description': row.description,
            'created_at': row.created_at,
            'author_name': row.author_name
        }
        questions.append(question)
    
    cursor.close()
    conn.close()
    
    return jsonify({'questions': questions, 'success': True})


# add an answer
@app.route('/api/add-answer', methods=['POST'])
def add_answer():
    data = request.get_json()
    content = data.get('content')
    author_id = data.get('author_id')
    question_id = data.get('question_id')
    created_at_unix = time.time()
    created_at_sql = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(created_at_unix))
    num_likes = 0
    
    if not content or not author_id or not question_id:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    
    insert_query = """
    INSERT INTO answers (content, author_id, question_id, created_at, num_votes)
    VALUES (?, ?, ?, ?, ?);
    """
    
    try:
        cursor.execute(insert_query, (content, author_id, question_id, created_at_sql, num_likes))
        conn.commit()  # Commit the transaction to make changes permanent
        return jsonify({'success': True}), 201

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()



@app.route('/api/like-answer', methods=['POST'])
def like_answer():
    data = request.get_json()
    answer_id = data.get('answer_id')
    
    if not answer_id:
        return jsonify({'success': False, 'message': 'Answer ID is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    update_query = """
    UPDATE answers
    SET num_votes = num_votes + 1
    WHERE answer_id = ?;
    """
    
    try:
        cursor.execute(update_query, (answer_id,))
        conn.commit()  # Commit the transaction to make changes permanent
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# API End point for Payment modal

@app.route('/api/payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    user_id = data['userId']  # Assuming you get this from the frontend
    payment_amount = 30 # Assuming you get this from the frontend
    payment_status = 'Completed'
    # Get current timestamp (Unix time)
    created_at_unix = time.time()
    created_at = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(created_at_unix))
    subscription_start_date = created_at
    subscription_end_date = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(created_at_unix + (30 * 24 * 60 * 60)))   # Assuming a 30-day subscription

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into UserSubscription table
        cursor.execute('''
            INSERT INTO UserSubscription (user_id, subscriptionStartDate, subscriptionEndDate, PaymentStatus, PaymentAmount, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, subscription_start_date, subscription_end_date, payment_status, payment_amount, created_at))

        # Update User table to set subscription to 'premium'
        cursor.execute('''
            UPDATE Users
            SET subscription = 'premium'
            WHERE user_id = ?
        ''', (user_id))

        conn.commit()


        cursor.close()
        conn.close()

        return jsonify({'message': 'Payment processed and subscription updated successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500    

@app.route('/api/schedule_appointment', methods=['POST'])
def schedule_appointment():
    data = request.get_json()

    print(data)
    user_id = data['userId']
    category = data['category']
    title = data['title']
    description = data['description']
    current_time = time.time()
    created_at = datetime.fromtimestamp(current_time).strftime('%Y-%m-%d %H:%M:%S')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into scheduledappointments table
        cursor.execute('''
            INSERT INTO ScheduledAppointments (user_id, category, title, description, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, category, title, description, created_at))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Appointment scheduled successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500




# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
