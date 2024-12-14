import smtplib, ssl
from dotenv import load_dotenv
from os import getenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
load_dotenv()
def send_email(sender, receiver, subject, message):
    host = getenv("SMTP_HOST")
    print(host)
    
    username = getenv("SMTP_USERNAME")
    password = getenv("SMTP_PASSWORD")
    port = getenv("SMTP_PORT")

    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    message_body = MIMEMultipart("alternative")
    message_body["Subject"] = subject
    message_body["From"] = sender
    message_body["To"] = receiver
#     message_body = f"""\
# Subject: {subject}

# {message}
#     """
#     try:
#         with smtplib.SMTP(host=host, port=port) as server:
#             server.starttls(context=context) # Secure the connection
#             server.login(user=username, password=password)
#             print(f"{username}, {password}")
#             print(message)
#             server.sendmail(from_addr=sender, to_addrs=receiver, msg=message_body)
        
#     except Exception as e:
#         print(e)
    html = f"""\
{message}
"""
    html_part = MIMEText(html, "html")
    message_body.attach(html_part) 
    try:
        with smtplib.SMTP(host=host, port=port) as server:
            server.starttls(context=context) # Secure the connection
            server.login(user=username, password=password)
            print(f"{username}, {password}")
            print(message)
            server.sendmail(from_addr=sender, to_addrs=receiver, msg=message_body.as_string())
            print('all good')
        
    except Exception as e:
        print(e)
if __name__ == "__main__":
    send_email(sender = "waitwut8@gmail.com", receiver = "waitwut8@gmail.com", subject = "Hello at 3:31", message="hello world at 3:31")
