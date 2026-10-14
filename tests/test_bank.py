"""Checks on the exported bank and the cut-off table. Run: python3 -m unittest tests/test_bank.py (from student-tracker)."""
import csv
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class CutoffTable(unittest.TestCase):
    def test_app_defaults_match_the_csv(self):
        """logic.js DEFAULT_CUTOFFS must equal data/dse-cutoffs.csv (L2 … L5** %)."""
        js = (ROOT / 'app/js/logic.js').read_text()
        block = re.search(r'DEFAULT_CUTOFFS = \{(.*?)\};', js, re.S).group(1)
        app = {int(y): [int(x) for x in v.split(',')] for y, v in re.findall(r'(\d{4}): \[([\d, ]+)\]', block)}
        with open(ROOT / 'data/dse-cutoffs.csv') as f:
            rows = {int(r['year']): [int(r[k]) for k in ('l2_pct', 'l3_pct', 'l4_pct', 'l5_pct', 'l5s_pct', 'l5ss_pct')]
                    for r in csv.DictReader(f)}
        self.assertEqual(app, rows)

    def test_cutoffs_rise(self):
        with open(ROOT / 'data/dse-cutoffs.csv') as f:
            for r in csv.DictReader(f):
                c = [int(r[k]) for k in ('l2_pct', 'l3_pct', 'l4_pct', 'l5_pct', 'l5s_pct', 'l5ss_pct')]
                self.assertEqual(c, sorted(c), r['year'])


class Bank(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bank = json.loads((ROOT / 'app/data/bank.json').read_text())
        cls.keys = json.loads((ROOT / 'data/dse-mc-keys.json').read_text())

    def test_mc_answers_match_official_keys(self):
        for y, p in self.bank['papers'].items():
            self.assertEqual([q['n'] for q in p['p1']], list(range(1, len(self.keys[y]) + 1)), y)
            for q in p['p1']:
                k = self.keys[y][q['n'] - 1]
                self.assertEqual(q['key'], None if k == '*' else k, f'{y} Q{q["n"]}')

    def test_paper2_totals(self):
        for y, p in self.bank['papers'].items():
            core = sum(x['marks'] for x in p['p2'] if not x['elective'])
            self.assertEqual(core + (16 if p['hasElective'] else 0), p['p2Total'], y)
            self.assertEqual(p['p2Total'], 104 if y in ('2021', '2022', '2023') else 120, y)

    def test_ids_unique_and_teaching_order_complete(self):
        ids = [x['id'] for p in self.bank['papers'].values() for x in p['p2']]
        self.assertEqual(len(ids), len(set(ids)))
        subs = {s['id'] for t in self.bank['topics'] for s in t['subtopics']}
        self.assertEqual(subs, set(self.bank['teachingOrder']))


if __name__ == '__main__':
    unittest.main()
