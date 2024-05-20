#!/usr/bin/env bash
#
# Convert all your "px" values to "rem" values. Supported filetypes can
# literally be anything, but just use extensions like :
# 1. Set "font-size: 15px" on your html tag
# 2. Run this script. with first arg to be your target and second to be your file type
# 3. Everything should be converted and nothing should be changed visually.

destination="$1"
filetype="$2"

usage() {
  echo "usage: sh ./rem-px.sh <destination> <type>"
  echo "example usage: sh ./rem-px.sh /src/* scss"
}

if [[ "$destination" == "" ]]; then
  echo "<destination> is undefined."
  echo
  usage
  exit 1
fi

if [[ "$filetype" == "" ]]; then
  echo "<type> is undefined."
  echo
  usage
  exit 1
fi

for file in $(find $destination -name *.$filetype); do
  echo "[$filetype] $file"
  perl -i -lpe 'BEGIN {
    sub rem {
      my ($num) = @_;
      ($num >= 5 and $num < 9000) ? ($num / 10) . "rem" : $num . "px"
    }
  } s/(\d+)px/(rem($1))/eg' $file
done