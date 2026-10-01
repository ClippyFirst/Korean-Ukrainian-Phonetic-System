from __future__ import annotations
from importlib import import_module
from typing import Mapping
DEFAULT_PACKAGE="ukrainian_phonetic_inventory"
EXPECTED_VERSION="0.8.0"

class UkrainianTargetAdapter:
    def __init__(self,package_name=DEFAULT_PACKAGE):
        self.package_name=package_name; self.available=False; self.version=None; self.inventory=None; self.error=None; self.grapheme_map={}
        try:
            pkg=import_module(package_name)
            self.version=getattr(pkg,"__version__",None)
            inv=import_module(package_name+".inventory")
            if self.version != EXPECTED_VERSION:
                raise RuntimeError(f"incompatible UPI version: expected {EXPECTED_VERSION}, found {self.version}")
            self.inventory=inv.load_inventory()
            try:
                for row in inv.load_table("graphemes.csv"):
                    ipa=row.get("ipa_primary","")
                    if ipa: self.grapheme_map[ipa]=row.get("grapheme","")
                for row in inv.load_table("transliteration_mapping.csv"):
                    ipa=row.get("input_ipa","")
                    grapheme=row.get("target_grapheme","")
                    if ipa and grapheme: self.grapheme_map.setdefault(ipa,grapheme)
            except Exception as exc:
                self.error=f"grapheme export unavailable: {type(exc).__name__}: {exc}"
            self.available=True
        except Exception as exc:
            self.error=f"{type(exc).__name__}: {exc}"
    def status(self):
        return {"available":self.available,"package":self.package_name,"version":self.version,"expected_version":EXPECTED_VERSION,"error":self.error}
    def candidates(self,source_features:Mapping[str,object],weights:Mapping[str,float]):
        if not source_features: return {"status":"needs_source_features","adapter":self.status(),"candidates":[]}
        if not self.available: return {"status":"unavailable","adapter":self.status(),"candidates":[]}
        from .correspondence import rank_candidates
        rows=[]
        for row in self.inventory.get("phonemes",[]):
            rows.append({"candidate_id":row.get("id"),"ipa":row.get("ipa"),"grapheme":self.grapheme_map.get(row.get("ipa"),""),"features":{k:v for k,v in row.get("features",{}).items() if k in weights},"status":row.get("status","unknown")})
        return {"status":"available","adapter":self.status(),"candidates":rank_candidates(source_features,rows,weights)}
