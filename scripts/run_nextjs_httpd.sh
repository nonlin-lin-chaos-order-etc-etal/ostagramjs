echo -n " initializing nvm... "
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo "nvm done."

nvm install v16.0.0
nvm use v16.0.0
npm install && npm run build && sudo apt -y install curl python3.9

echo 'launching the httpd'
npm run start
