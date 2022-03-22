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

# user 1: 0 wins, 2 losses
# user 2: 3 wins, 1 loss
# user 3: 1 win, 2 loss
# user 4: 1 win, 0 losses
matches=(
	'{"winner":"2","winnerScore":"12","loser":"1","loserScore":"6"}'
	'{"winner":"2","winnerScore":"49","loser":"3","loserScore":"19"}'
	'{"winner":"2","winnerScore":"23","loser":"3","loserScore":"12"}'
	'{"winner":"3","winnerScore":"1","loser":"1","loserScore":"0"}'
	'{"winner":"4","winnerScore":"13","loser":"2","loserScore":"4"}'
)

for match in ${matches[@]}; do
	curl -X 'POST' \
  'http://localhost:3000/match/create' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d $match
  echo ""
done
