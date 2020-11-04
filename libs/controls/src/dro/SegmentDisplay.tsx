/*!
 * Copied from segment-display.js in order to create a React component
 *
 * Copyright 2012, Rüdiger Appel
 * http://www.3quarks.com
 * Published under Creative Commons 3.0 License.
 *
 * Date: 2012-02-14
 * Version: 1.0.0
 *
 * Dokumentation: http://www.3quarks.com/de/Segmentanzeige
 * Documentation: http://www.3quarks.com/en/SegmentDisplay
 */
// Segment display types
import * as React from "react";

enum SegmentCount {
    SevenSegment = 7,
    // FourteenSegment = 14,
    // SixteenSegment = 16
}

// Segment corner types
enum SegmentCornerType {
    SymmetricCorner = 0,
    SquaredCorner = 1,
    RoundedCorner = 2,
}

type SegmentDisplayProps = {
    value: number,
    displayAngle?: number
}

export class SegmentDisplay extends React.Component<SegmentDisplayProps, any> {
    pattern = '#####.###';
    digitHeight = 10;
    digitWidth = 5;
    digitDistance = 2;
    displayAngle = 6;
    segmentWidth = 1;
    segmentDistance = 0.75;
    segmentCount = SegmentCount.SevenSegment;
    cornerType = SegmentCornerType.RoundedCorner;
    colorOn = 'rgb(84, 84, 108)';
    colorOff = 'rgb(235, 235, 255)';

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const sgn = Math.sign(this.props.value);
        const value = (sgn < 0 ? "-" : " ") + Math.abs(this.props.value).toFixed(3).padStart(8, " ");
        if (this.props.displayAngle !== undefined) {
            this.displayAngle = this.props.displayAngle;
        }

        let i;
        const display: HTMLCanvasElement = this.refs.canvas as HTMLCanvasElement;
        if (display) {
            const context = display.getContext('2d');
            if (context) {
                // clear canvas
                context.clearRect(0, 0, display.width, display.height);

                // compute and check display width
                let width = 0;
                let first = true;
                if (this.pattern) {
                    for (i = 0; i < this.pattern.length; i++) {
                        const c = this.pattern.charAt(i).toLowerCase();
                        if (c == '#') {
                            width += this.digitWidth;
                        } else if (c == '.' || c == ':') {
                            width += this.segmentWidth;
                        } else if (c != ' ') {
                            return;
                        }
                        width += first ? 0 : this.digitDistance;
                        first = false;
                    }
                }
                if (width <= 0) {
                    return;
                }

                // compute skew factor
                const angle = -1.0 * Math.max(-45.0, Math.min(45.0, this.displayAngle));
                const skew = Math.tan((angle * Math.PI) / 180.0);

                // compute scale factor
                const scale = Math.min(display.width / (width + Math.abs(skew * this.digitHeight)), display.height / this.digitHeight);

                // compute display offset
                const offsetX = (display.width - (width + skew * this.digitHeight) * scale) / 2.0;
                const offsetY = (display.height - this.digitHeight * scale) / 2.0;

                // context transformation
                context.save();
                context.translate(offsetX, offsetY);
                context.scale(scale, scale);
                context.transform(1, 0, skew, 1, 0, 0);

                // draw segments
                let xPos = 0;
                const size = (value) ? value.length : 0;
                for (i = 0; i < this.pattern.length; i++) {
                    const mask = this.pattern.charAt(i);
                    const v = (i < size) ? value.charAt(i).toLowerCase() : ' ';
                    xPos += this.drawDigit(context, xPos, mask, v);
                }

                // finish drawing
                context.restore();
            }
        }
    }

    drawDigit(context, xPos, mask, c) {
        let y;
        let x;
        switch (mask) {
            case '#':
                const r = Math.sqrt(this.segmentWidth * this.segmentWidth / 2.0);
                const d = Math.sqrt(this.segmentDistance * this.segmentDistance / 2.0);
                const e = d / 2.0;
                const f = (this.segmentWidth - d) * Math.sin((45.0 * Math.PI) / 180.0);
                const g = f / 2.0;
                const h = (this.digitHeight - 3.0 * this.segmentWidth) / 2.0;
                const w = (this.digitWidth - 3.0 * this.segmentWidth) / 2.0;
                const s = this.segmentWidth / 2.0;
                const t = this.digitWidth / 2.0;

                // draw segment a (a1 and a2 for 16 segments)
                if (this.segmentCount == 16) {
                    x = xPos;
                    y = 0;
                    context.fillStyle = this.getSegmentColor(c, null, '02356789abcdefgiopqrstz@%');
                    context.beginPath();
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.moveTo(x + s + d, y + s);
                            context.lineTo(x + this.segmentWidth + d, y);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.moveTo(x + s + e, y + s - e);
                            context.lineTo(x + this.segmentWidth, y);
                            break;
                        default:
                            context.moveTo(x + this.segmentWidth - f, y + this.segmentWidth - f - d);
                            context.quadraticCurveTo(x + this.segmentWidth - g, y, x + this.segmentWidth, y);
                    }
                    context.lineTo(x + t - d - s, y);
                    context.lineTo(x + t - d, y + s);
                    context.lineTo(x + t - d - s, y + this.segmentWidth);
                    context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                    context.fill();

                    x = xPos;
                    y = 0;
                    context.fillStyle = this.getSegmentColor(c, null, '02356789abcdefgiopqrstz@');
                    context.beginPath();
                    context.moveTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                    context.lineTo(x + t + d + s, y + this.segmentWidth);
                    context.lineTo(x + t + d, y + s);
                    context.lineTo(x + t + d + s, y);
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                            context.lineTo(x + this.digitWidth - s - d, y + s);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
                            context.lineTo(x + this.digitWidth - s - e, y + s - e);
                            break;
                        default:
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
                            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y, x + this.digitWidth - this.segmentWidth + f, y + this.segmentWidth - f - d);
                    }
                    context.fill();

                } else {
                    x = xPos;
                    y = 0;
                    context.fillStyle = this.getSegmentColor(c, '02356789acefp', '02356789abcdefgiopqrstz@');
                    context.beginPath();
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.moveTo(x + s + d, y + s);
                            context.lineTo(x + this.segmentWidth + d, y);
                            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                            context.lineTo(x + this.digitWidth - s - d, y + s);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.moveTo(x + s + e, y + s - e);
                            context.lineTo(x + this.segmentWidth, y);
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
                            context.lineTo(x + this.digitWidth - s - e, y + s - e);
                            break;
                        default:
                            context.moveTo(x + this.segmentWidth - f, y + this.segmentWidth - f - d);
                            context.quadraticCurveTo(x + this.segmentWidth - g, y, x + this.segmentWidth, y);
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y);
                            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y, x + this.digitWidth - this.segmentWidth + f, y + this.segmentWidth - f - d);
                    }
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                    context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                    context.fill();
                }

                // draw segment b
                x = xPos + this.digitWidth - this.segmentWidth;
                y = 0;
                context.fillStyle = this.getSegmentColor(c, '01234789adhpy', '01234789abdhjmnopqruwy');
                context.beginPath();
                switch (this.cornerType) {
                    case SegmentCornerType.SymmetricCorner:
                        context.moveTo(x + s, y + s + d);
                        context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
                        break;
                    case SegmentCornerType.SquaredCorner:
                        context.moveTo(x + s + e, y + s + e);
                        context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
                        break;
                    default:
                        context.moveTo(x + f + d, y + this.segmentWidth - f);
                        context.quadraticCurveTo(x + this.segmentWidth, y + this.segmentWidth - g, x + this.segmentWidth, y + this.segmentWidth);
                }
                context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
                context.lineTo(x + s, y + h + this.segmentWidth + s - d);
                context.lineTo(x, y + h + this.segmentWidth - d);
                context.lineTo(x, y + this.segmentWidth + d);
                context.fill();

                // draw segment c
                x = xPos + this.digitWidth - this.segmentWidth;
                y = h + this.segmentWidth;
                context.fillStyle = this.getSegmentColor(c, '013456789abdhnouy', '01346789abdghjmnoqsuw@', '%');
                context.beginPath();
                context.moveTo(x, y + this.segmentWidth + d);
                context.lineTo(x + s, y + s + d);
                context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
                context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
                switch (this.cornerType) {
                    case SegmentCornerType.SymmetricCorner:
                        context.lineTo(x + s, y + h + this.segmentWidth + s - d);
                        context.lineTo(x, y + h + this.segmentWidth - d);
                        break;
                    case SegmentCornerType.SquaredCorner:
                        context.lineTo(x + s + e, y + h + this.segmentWidth + s - e);
                        context.lineTo(x, y + h + this.segmentWidth - d);
                        break;
                    default:
                        context.quadraticCurveTo(x + this.segmentWidth, y + h + this.segmentWidth + g, x + f + d, y + h + this.segmentWidth + f); //
                        context.lineTo(x, y + h + this.segmentWidth - d);
                }
                context.fill();

                // draw segment d (d1 and d2 for 16 segments)
                if (this.segmentCount == 16) {
                    x = xPos;
                    y = this.digitHeight - this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, '0235689bcdegijloqsuz_=@');
                    context.beginPath();
                    context.moveTo(x + this.segmentWidth + d, y);
                    context.lineTo(x + t - d - s, y);
                    context.lineTo(x + t - d, y + s);
                    context.lineTo(x + t - d - s, y + this.segmentWidth);
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                            context.lineTo(x + s + d, y + s);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
                            context.lineTo(x + s + e, y + s + e);
                            break;
                        default:
                            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
                            context.quadraticCurveTo(x + this.segmentWidth - g, y + this.segmentWidth, x + this.segmentWidth - f, y + f + d);
                            context.lineTo(x + this.segmentWidth - f, y + f + d);
                    }
                    context.fill();

                    x = xPos;
                    y = this.digitHeight - this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, '0235689bcdegijloqsuz_=@', '%');
                    context.beginPath();
                    context.moveTo(x + t + d + s, y + this.segmentWidth);
                    context.lineTo(x + t + d, y + s);
                    context.lineTo(x + t + d + s, y);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.lineTo(x + this.digitWidth - s - d, y + s);
                            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.lineTo(x + this.digitWidth - s - e, y + s + e);
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
                            break;
                        default:
                            context.lineTo(x + this.digitWidth - this.segmentWidth + f, y + f + d);
                            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y + this.segmentWidth, x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
                    }
                    context.fill();
                } else {
                    x = xPos;
                    y = this.digitHeight - this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, '0235689bcdelotuy_', '0235689bcdegijloqsuz_=@');
                    context.beginPath();
                    context.moveTo(x + this.segmentWidth + d, y);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                    switch (this.cornerType) {
                        case SegmentCornerType.SymmetricCorner:
                            context.lineTo(x + this.digitWidth - s - d, y + s);
                            context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                            context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                            context.lineTo(x + s + d, y + s);
                            break;
                        case SegmentCornerType.SquaredCorner:
                            context.lineTo(x + this.digitWidth - s - e, y + s + e);
                            context.lineTo(x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
                            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
                            context.lineTo(x + s + e, y + s + e);
                            break;
                        default:
                            context.lineTo(x + this.digitWidth - this.segmentWidth + f, y + f + d);
                            context.quadraticCurveTo(x + this.digitWidth - this.segmentWidth + g, y + this.segmentWidth, x + this.digitWidth - this.segmentWidth, y + this.segmentWidth);
                            context.lineTo(x + this.segmentWidth, y + this.segmentWidth);
                            context.quadraticCurveTo(x + this.segmentWidth - g, y + this.segmentWidth, x + this.segmentWidth - f, y + f + d);
                            context.lineTo(x + this.segmentWidth - f, y + f + d);
                    }
                    context.fill();
                }

                // draw segment e
                x = xPos;
                y = h + this.segmentWidth;
                context.fillStyle = this.getSegmentColor(c, '0268abcdefhlnoprtu', '0268acefghjklmnopqruvw@');
                context.beginPath();
                context.moveTo(x, y + this.segmentWidth + d);
                context.lineTo(x + s, y + s + d);
                context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
                context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
                switch (this.cornerType) {
                    case SegmentCornerType.SymmetricCorner:
                        context.lineTo(x + s, y + h + this.segmentWidth + s - d);
                        context.lineTo(x, y + h + this.segmentWidth - d);
                        break;
                    case SegmentCornerType.SquaredCorner:
                        context.lineTo(x + s - e, y + h + this.segmentWidth + s - d + e);
                        context.lineTo(x, y + h + this.segmentWidth);
                        break;
                    default:
                        context.lineTo(x + this.segmentWidth - f - d, y + h + this.segmentWidth + f);
                        context.quadraticCurveTo(x, y + h + this.segmentWidth + g, x, y + h + this.segmentWidth);
                }
                context.fill();

                // draw segment f
                x = xPos;
                y = 0;
                context.fillStyle = this.getSegmentColor(c, '045689abcefhlpty', '045689acefghklmnopqrsuvwy@', '%');
                context.beginPath();
                context.moveTo(x + this.segmentWidth, y + this.segmentWidth + d);
                context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
                context.lineTo(x + s, y + h + this.segmentWidth + s - d);
                context.lineTo(x, y + h + this.segmentWidth - d);
                switch (this.cornerType) {
                    case SegmentCornerType.SymmetricCorner:
                        context.lineTo(x, y + this.segmentWidth + d);
                        context.lineTo(x + s, y + s + d);
                        break;
                    case SegmentCornerType.SquaredCorner:
                        context.lineTo(x, y + this.segmentWidth);
                        context.lineTo(x + s - e, y + s + e);
                        break;
                    default:
                        context.lineTo(x, y + this.segmentWidth);
                        context.quadraticCurveTo(x, y + this.segmentWidth - g, x + this.segmentWidth - f - d, y + this.segmentWidth - f);
                        context.lineTo(x + this.segmentWidth - f - d, y + this.segmentWidth - f);
                }
                context.fill();

                // draw segment g for 7 segments
                if (this.segmentCount == 7) {
                    x = xPos;
                    y = (this.digitHeight - this.segmentWidth) / 2.0;
                    context.fillStyle = this.getSegmentColor(c, '2345689abdefhnoprty-=');
                    context.beginPath();
                    context.moveTo(x + s + d, y + s);
                    context.lineTo(x + this.segmentWidth + d, y);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                    context.lineTo(x + this.digitWidth - s - d, y + s);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                    context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                    context.fill();
                }

                // draw inner segments for the fourteen- and sixteen-segment-display
                if (this.segmentCount != 7) {
                    // draw segment g1
                    x = xPos;
                    y = (this.digitHeight - this.segmentWidth) / 2.0;
                    context.fillStyle = this.getSegmentColor(c, null, '2345689aefhkprsy-+*=', '%');
                    context.beginPath();
                    context.moveTo(x + s + d, y + s);
                    context.lineTo(x + this.segmentWidth + d, y);
                    context.lineTo(x + t - d - s, y);
                    context.lineTo(x + t - d, y + s);
                    context.lineTo(x + t - d - s, y + this.segmentWidth);
                    context.lineTo(x + this.segmentWidth + d, y + this.segmentWidth);
                    context.fill();

                    // draw segment g2
                    x = xPos;
                    y = (this.digitHeight - this.segmentWidth) / 2.0;
                    context.fillStyle = this.getSegmentColor(c, null, '234689abefghprsy-+*=@', '%');
                    context.beginPath();
                    context.moveTo(x + t + d, y + s);
                    context.lineTo(x + t + d + s, y);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y);
                    context.lineTo(x + this.digitWidth - s - d, y + s);
                    context.lineTo(x + this.digitWidth - this.segmentWidth - d, y + this.segmentWidth);
                    context.lineTo(x + t + d + s, y + this.segmentWidth);
                    context.fill();

                    // draw segment j
                    x = xPos + t - s;
                    y = 0;
                    context.fillStyle = this.getSegmentColor(c, null, 'bdit+*', '%');
                    context.beginPath();
                    if (this.segmentCount == 14) {
                        context.moveTo(x, y + this.segmentWidth + this.segmentDistance);
                        context.lineTo(x + this.segmentWidth, y + this.segmentWidth + this.segmentDistance);
                    } else {
                        context.moveTo(x, y + this.segmentWidth + d);
                        context.lineTo(x + s, y + s + d);
                        context.lineTo(x + this.segmentWidth, y + this.segmentWidth + d);
                    }
                    context.lineTo(x + this.segmentWidth, y + h + this.segmentWidth - d);
                    context.lineTo(x + s, y + h + this.segmentWidth + s - d);
                    context.lineTo(x, y + h + this.segmentWidth - d);
                    context.fill();

                    // draw segment m
                    x = xPos + t - s;
                    y = this.digitHeight;
                    context.fillStyle = this.getSegmentColor(c, null, 'bdity+*@', '%');
                    context.beginPath();
                    if (this.segmentCount == 14) {
                        context.moveTo(x, y - this.segmentWidth - this.segmentDistance);
                        context.lineTo(x + this.segmentWidth, y - this.segmentWidth - this.segmentDistance);
                    } else {
                        context.moveTo(x, y - this.segmentWidth - d);
                        context.lineTo(x + s, y - s - d);
                        context.lineTo(x + this.segmentWidth, y - this.segmentWidth - d);
                    }
                    context.lineTo(x + this.segmentWidth, y - h - this.segmentWidth + d);
                    context.lineTo(x + s, y - h - this.segmentWidth - s + d);
                    context.lineTo(x, y - h - this.segmentWidth + d);
                    context.fill();

                    // draw segment h
                    x = xPos + this.segmentWidth;
                    // noinspection JSSuspiciousNameCombination
                    y = this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, 'mnx\\*');
                    context.beginPath();
                    context.moveTo(x + this.segmentDistance, y + this.segmentDistance);
                    context.lineTo(x + this.segmentDistance + r, y + this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance, y + h - this.segmentDistance - r);
                    context.lineTo(x + w - this.segmentDistance, y + h - this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance - r, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + this.segmentDistance + r);
                    context.fill();

                    // draw segment k
                    x = xPos + w + 2.0 * this.segmentWidth;
                    // noinspection JSSuspiciousNameCombination
                    y = this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, '0kmvxz/*', '%');
                    context.beginPath();
                    context.moveTo(x + w - this.segmentDistance, y + this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance, y + this.segmentDistance + r);
                    context.lineTo(x + this.segmentDistance + r, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance - r);
                    context.lineTo(x + w - this.segmentDistance - r, y + this.segmentDistance);
                    context.fill();

                    // draw segment l
                    x = xPos + w + 2.0 * this.segmentWidth;
                    y = h + 2.0 * this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, '5knqrwx\\*');
                    context.beginPath();
                    context.moveTo(x + this.segmentDistance, y + this.segmentDistance);
                    context.lineTo(x + this.segmentDistance + r, y + this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance, y + h - this.segmentDistance - r);
                    context.lineTo(x + w - this.segmentDistance, y + h - this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance - r, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + this.segmentDistance + r);
                    context.fill();

                    // draw segment n
                    x = xPos + this.segmentWidth;
                    y = h + 2.0 * this.segmentWidth;
                    context.fillStyle = this.getSegmentColor(c, null, '0vwxz/*', '%');
                    context.beginPath();
                    context.moveTo(x + w - this.segmentDistance, y + this.segmentDistance);
                    context.lineTo(x + w - this.segmentDistance, y + this.segmentDistance + r);
                    context.lineTo(x + this.segmentDistance + r, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance);
                    context.lineTo(x + this.segmentDistance, y + h - this.segmentDistance - r);
                    context.lineTo(x + w - this.segmentDistance - r, y + this.segmentDistance);
                    context.fill();
                }

                return this.digitDistance + this.digitWidth;

            case '.':
                context.fillStyle = (c == '#') || (c == '.') ? this.colorOn : this.colorOff;
                SegmentDisplay.drawPoint(context, xPos, this.digitHeight - this.segmentWidth, this.segmentWidth);
                return this.digitDistance + this.segmentWidth;

            case ':':
                context.fillStyle = (c == '#') || (c == ':') ? this.colorOn : this.colorOff;
                y = (this.digitHeight - this.segmentWidth) / 2.0 - this.segmentWidth;
                SegmentDisplay.drawPoint(context, xPos, y, this.segmentWidth);
                SegmentDisplay.drawPoint(context, xPos, y + 2.0 * this.segmentWidth, this.segmentWidth);
                return this.digitDistance + this.segmentWidth;

            default:
                return this.digitDistance;
        }
    }

    static drawPoint(context, x1, y1, size) {
        const x2 = x1 + size;
        const y2 = y1 + size;
        const d = size / 4.0;

        context.beginPath();
        context.moveTo(x2 - d, y1);
        context.quadraticCurveTo(x2, y1, x2, y1 + d);
        context.lineTo(x2, y2 - d);
        context.quadraticCurveTo(x2, y2, x2 - d, y2);
        context.lineTo(x1 + d, y2);
        context.quadraticCurveTo(x1, y2, x1, y2 - d);
        context.lineTo(x1, y1 + d);
        context.quadraticCurveTo(x1, y1, x1 + d, y1);
        context.fill();
    };

    getSegmentColor(c, charSet7, charSet14: string | undefined = undefined, charSet16: string | undefined = undefined) {
        if (c == '#') {
            return this.colorOn;
        } else {
            switch (this.segmentCount) {
                case 7:
                    return (charSet7.indexOf(c) == -1) ? this.colorOff : this.colorOn;
                case 14:
                    return (charSet14!.indexOf(c) == -1) ? this.colorOff : this.colorOn;
                case 16:
                    const pattern = charSet14! + (charSet16 === undefined ? '' : charSet16);
                    return (pattern.indexOf(c) == -1) ? this.colorOff : this.colorOn;
                default:
                    return this.colorOff;
            }
        }
    }

    render() {
        return <canvas ref="canvas" width={140} height={20}/>
    }
}

(SegmentDisplay as any).defaultProps={
    displayAngle: 6
};