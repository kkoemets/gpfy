FROM python:3
COPY . .
RUN pip3 install -r requirements.txt
CMD ["src/run_telegram_bot.py"]
ENTRYPOINT ["python3"]
