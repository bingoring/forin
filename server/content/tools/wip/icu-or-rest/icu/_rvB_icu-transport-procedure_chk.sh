cd /Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu
python3 build_icu-transport-procedure_B.py | tail -1 | cut -c1-60
python3 /Users/ywyeom/private/forin/server/content/tools/verify_one_theme.py icu icu-transport-procedure.B.yaml 2>&1 | grep -E "^\s+\[|==>"
python3 _rvB_icu-transport-procedure_freq.py
