export class Law {
    id;
    by;
    text;
    proposeDate = null;
    pro = new Set();
    contra = new Set();
    toJSON() {
        return {
            id: this.id,
            by: this.by.id,
            text: this.text,
            proposeDate: this.proposeDate,
            pro: Array.from(this.pro, (x) => x.id),
            contra: Array.from(this.contra, (x) => x.id),
        };
    }
}
export class Parliament {
    capitalRegion;
    isAutonomy;
    laws = [];
    toJSON() {
        return {
            capitalRegion: this.capitalRegion.id,
            isAutonomy: this.isAutonomy,
            laws: this.laws,
        };
    }
}
