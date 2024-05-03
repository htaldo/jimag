tmux new-session -d -s jimag_session

tmux send-keys -t jimag_session "python manage.py runserver"
Enter

tmux split-window -v -t jimag_session
tmux send-keys -t jimag_session "redis-server --port 6380"
Enter

tmux split-window -v -t jimag_session
tmux send-keys -t jimag_session "python manage.py rqworker"
Enter

tmux attach-session -t jimag_session
