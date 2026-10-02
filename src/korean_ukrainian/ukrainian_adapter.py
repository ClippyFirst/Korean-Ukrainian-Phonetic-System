from __future__ import annotations
from importlib import import_module
from typing import Mapping

DEFAULT_PACKAGE="ukrainian_phonetic_inventory"
EXPECTED_VERSION="0.8.0"

class UkrainianTargetAdapter:
    def __init__(self,package_name=DEFAULT_PACKAGE):
        self.package_name=package_name
        self.available=False
        self.version=None
        self.inventory=None
        self.error=None
        self.grapheme_map={}
        self.mapping_index={}
        try:
            pkg=import_module(package_name)
            self.version=getattr(pkg,"__version__",None)
            inv=import_module(package_name+".inventory")
            if self.version != EXPECTED_VERSION:
                raise RuntimeError(f"incompatible UPI version: expected {EXPECTED_VERSION}, found {self.version}")
            self.inventory=inv.load_inventory()
            for row in inv.load_table("graphemes.csv"):
                ipa=row.get("ipa_primary","")
                if ipa:
                    self.grapheme_map[ipa]=row.get("grapheme","")
            try:
                for row in inv.load_table("transliteration_mapping.csv"):
                    source=row.get("input_ipa","")
                    target=row.get("target_ipa","")
                    if source and target:
                        self.mapping_index.setdefault((source,target),[]).append(row)
                    grapheme=row.get("target_grapheme","")
                    if target and grapheme:
                        self.grapheme_map.setdefault(target,grapheme)
            except Exception as exc:
                self.error=f"mapping export unavailable: {type(exc).__name__}: {exc}"
            self.available=True
        except Exception as exc:
            self.error=f"{type(exc).__name__}: {exc}"

    def status(self):
        return {
            "available":self.available,
            "package":self.package_name,
            "version":self.version,
            "expected_version":EXPECTED_VERSION,
            "error":self.error,
        }

    def candidates(self,source_features:Mapping[str,object],weights:Mapping[str,float],source_ipa:str|None=None,context:str="default"):
        if not source_features:
            return {"status":"needs_source_features","adapter":self.status(),"candidates":[]}
        if not self.available:
            return {"status":"unavailable","adapter":self.status(),"candidates":[]}
        from .correspondence import rank_candidates
        rows=[]
        for row in self.inventory.get("phonemes",[]):
            target_ipa=row.get("ipa","")
            mappings=self.mapping_index.get((source_ipa or "",target_ipa),[])
            selected=next((m for m in mappings if m.get("context","default")==context),None)
            if selected is None:
                selected=next(iter(mappings),None)
            rows.append({
                "candidate_id":row.get("id"),
                "ipa":target_ipa,
                "grapheme":self.grapheme_map.get(target_ipa,""),
                "features":{k:v for k,v in row.get("features",{}).items() if k in weights},
                "status":row.get("status","unknown"),
                "mapping_id":selected.get("mapping_id") if selected else None,
                "mapping_status":selected.get("status") if selected else "unmapped",
                "context":selected.get("context") if selected else None,
                "context_penalty":float(selected.get("context_penalty",0) or 0) if selected else 0.0,
                "phonotactic_penalty":float(selected.get("phonotactic_penalty",0) or 0) if selected else 0.0,
                "orthographic_penalty":float(selected.get("orthographic_penalty",0) or 0) if selected else 0.0,
            })
        ranked=rank_candidates(source_features,rows,weights)
        return {"status":"available","adapter":self.status(),"candidates":ranked}
