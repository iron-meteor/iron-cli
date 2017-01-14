#######################################################################
# Use this script to do any pre-processing to your env.sh scripts     #
#######################################################################
# Example below is decrypting your env.sh file before sourcing,       #
# useful when you want to keep credentials out of the git repo.       #
# Not useful for hiding credentials on server or developer machines.  #
#######################################################################
#
# gpg2 --batch --quiet --no-verbose -d "$1" > /tmp/env.sh
# . /tmp/env.sh
# # Linux
# shred /tmp/env.sh
# # OSX
# srm /tmp/env.sh

# You only want to have one "source" command so if you do any
# pre-processing of your env.sh, like above, comment this next line out
# NOTE: Apparently using a the dot syntax instead of the `source`
# command is more portable. "$1" is variable with the path to env.sh
. "$1"

# DO NOT MODIFY BELOW THIS POINT
# Environment needs to be printed to console so it can be read in by iron
printenv
