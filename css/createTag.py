import sys

arr = sys.argv[1].split(',')
for x in arr:
    print(f'<i class="tag">{x.strip()}</i>', end=" ")
