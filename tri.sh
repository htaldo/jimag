tmux new-session -d -s jimag_session

tmux send-keys -t jimag_session "python manage.py runserver" C-m

tmux split-window -v -t jimag_session
tmux send-keys -t jimag_session "redis-server --port 6379" C-m

tmux split-window -v -t jimag_session
tmux send-keys -t jimag_session "python manage.py rqworker" C-m

tmux attach-session -t jimag_session
