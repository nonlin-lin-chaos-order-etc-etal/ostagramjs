exit 1

# obsolete stuff follows

echo -n " initializing nvm... "
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo "nvm done."

nvm install v16.0.0
nvm use v16.0.0
npm install && npm run build && sudo apt -y install curl python3.9

mkdir -pv ~/vcs
virtualenv --python=python3.9 ~/vcs/ostagramjs_venv3.9
. ~/vcs/ostagramjs_venv3.9/bin/activate
pip install -r requirements.txt
pushd ~/vcs
echo "installing qt4"
sudo add-apt-repository ppa:rock-core/qt4
sudo apt-get update
sudo apt -y install qt4-default
echo "qt4 done."
echo 'installing torch7...'
cd ~/vcs
curl -s https://raw.githubusercontent.com/torch/ezinstall/master/install-deps | bash
git clone https://github.com/torch/distro.git ~/torch --recursive
ln -vs ~/vcs/torch ~/torch
cd ~/vcs/torch && ./install.sh
source ~/.bashrc
echo torch7 installed
echo 'installing loadcaffe...'
luarocks install loadcaffe
echo loadcaffe installed
echo 'fetching ns repo...'
cd ~/vcs
git clone https://github.com/jcjohnson/neural-style.git
ln -vs ~/vcs/neural-style ~/neural-style
cd neural-style
echo 'ns repo done.'
echo 'fetching ns pretrained neural network models...'
sh models/download_models.sh
echo 'fetched.'
popd
echo 'launching the httpd'
npm run start
