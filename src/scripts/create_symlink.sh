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
#             Mpeerdeman        |   https://github.com/Maqrkk                  #
#             Rpet              |   https://github.com/rpet91                  #
#             Mraasvel          |   https://github.com/mraasvel                #
#             Ikole             |   https://github.com/K1ngmar                 #
#             Nvan-aac          |   https://github.com/vanaacken               #
#                                                                              #
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  #


SPath="/sgoinfre/$LOGNAME/Containers"
LPath="/Users/$LOGNAME/Library/Containers"

# create containers directory in sgoinfre if it doesn't exist yet
mkdir -p $SPath

# remove old directory
rm -rf $LPath

# replace it with a symlink to sgroinfre
ln -s $SPath $LPath
