#!/bin/bash
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  #
#                                                                              #
#               __    __   ______    ______   ________  _______                #
#              /  \  /  | /      \  /      \ /        |/       \               #
#              $$  \ $$ |/$$$$$$  |/$$$$$$  |$$$$$$$$/ $$$$$$$  |              #
#              $$$  \$$ |$$ |  $$/ $$ |  $$ |   $$ |   $$ |__$$ |              #
#              $$$$  $$ |$$ |      $$ |  $$ |   $$ |   $$    $$<               #
#              $$ $$ $$ |$$ |   __ $$ |  $$ |   $$ |   $$$$$$$  |              #
#              $$ |$$$$ |$$ \__/  |$$ \__$$ |   $$ |   $$ |__$$ |              #
#              $$ | $$$ |$$    $$/ $$    $$/    $$ |   $$    $$/               #
#              $$/   $$/  $$$$$$/   $$$$$$/     $$/    $$$$$$$/                #
#                                                                              #
#                                                                              #
#                           New Coders on the Block                            #
#    ——————————————————————————————————————————————————————————————————————    #
#                 Mpeerdem   |   https://github.com/Maqrkk                     #
#                 Rpet       |   https://github.com/rpet91                     #
#                 Mraasvel   |   https://github.com/mraasvel                   #
#                 Ikole      |   https://github.com/K1ngmar                    #
#                 Nvan-aac   |   https://github.com/vanaacken                  #
#                                                                              #
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  #

TargetPath="/Users/$LOGNAME/goinfre/Containers/com.docker.docker"
OldPath="/Users/$LOGNAME/Library/Containers/com.docker.docker"

# create containers directory in sgoinfre if it doesn't exist yet
mkdir -p $TargetPath

if [[ -L $OldPath ]]; then
  echo "Symlink already exists!"
else
	# remove old directory
	rm -rf $OldPath
	# replace it with a symlink to sgroinfre
	ln -s $TargetPath $OldPath
	echo "Symlink created!"
fi
