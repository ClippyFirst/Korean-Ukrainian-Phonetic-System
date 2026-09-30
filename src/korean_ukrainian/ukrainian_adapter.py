from __future__ import annotations
from importlib import import_module
from typing import Mapping
DEFAULT_PACKAGE="ukrainian_phonetic_inventory"
EXPECTED_VERSION="1.0.0"
class UkrainianTargetAdapter:
    def __init__(self,package_name=DEFAULT_PACKAGE):
        self.package_name=package_name; self.available=False; self.version=None; self.inventory=None; self.error=None
        try:
            pkg=import_module(package_name); self.version=getattr(pkg,"__version__",None)
            inv=import_module(package_name+".inventory"); self.inventory=inv.load_inventory(); self.available=True
        except Exception as exc: self.error=f"{type(exc).__name__}: {exc}"
    def status(self):
        return {"available":self.available,"package":self.package_name,"version":self.version,"expected_version":EXPECTED_VERSION,"error":self.error}
    def candidates(self,source_features:Mapping[str,object],weights:Mapping[str,float]):
        if not self.available:return {"status":"unavailable","adapter":self.status(),"candidates":[]}
        from .correspondence import rank_candidates
        rows=[]
        for row in self.inventory.get("phonemes",[]):
            rows.append({"candidate_id":row.get("id"),"ipa":row.get("ipa"),"grapheme":row.get("grapheme"),"features":row.get("features",{}),"status":row.get("status","unknown")})
        return {"status":"available","adapter":self.status(),"candidates":rank_candidates(source_features,rows,weights)}
