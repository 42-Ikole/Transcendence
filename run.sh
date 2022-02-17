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

if [ "$1" == "-clean" ]; then
	bash src/scripts/clear.sh
elif [ "$1" == "-fclean" ]; then
	bash src/scripts/clear.sh -f
fi

# create symlink to goinfre
bash src/scripts/create_symlink.sh

# run docker compose
docker-compose up --build
