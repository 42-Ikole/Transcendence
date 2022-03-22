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

# create users
bash src/scripts/database/create_users.sh

# create matches
bash src/scripts/database/create_matches.sh
