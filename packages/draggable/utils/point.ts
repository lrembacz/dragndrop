export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(v: Point){
        return new Point(this.x + v.x, this.y + v.y);
    }

    distanceTo(v: Point){
        const x = this.x - v.x;
        const y = this.y - v.y;
        return Math.sqrt(x * x + y * y);
    }

    clone(){
        return new Point(this.x, this.y);
    }

    degreesTo(v: Point){
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const angle = Math.atan2(dy, dx); // radians
        return angle * (180 / Math.PI); // degrees
    }

    equals(toCompare: Point){
        return this.x == toCompare.x && this.y == toCompare.y;
    }

    interpolate(v: Point, f: number){
        return new Point( v.x + (this.x - v.x) * f, v.y + (this.y - v.y) * f );
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(thickness: number){
        const l = this.length();
        this.x = this.x / l * thickness;
        this.y = this.y / l * thickness;
    }

    orbit(origin: Point, arcWidth: number, arcHeight: number, degrees: number){
        const radians = degrees * (Math.PI / 180);
        this.x = origin.x + arcWidth * Math.cos(radians);
        this.y = origin.y + arcHeight * Math.sin(radians);
    }

    offset(dx: number, dy: number){
        this.x += dx;
        this.y += dy;
    }

    subtract(v: Point){
        return new Point(this.x - v.x, this.y - v.y);
    }

    toString(){
        return "(x=" + this.x + ", y=" + this.y + ")";
    }

    static interpolate(pt1: Point, pt2: Point, f: number){
        return pt1.interpolate(pt2, f);
    }

    polar(len: number, angle: number){
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    }

    distance(pt1: Point, pt2: Point){
        const x = pt1.x - pt2.x;
        const y = pt1.y - pt2.y;
        return Math.sqrt(x * x + y * y);
    };

}