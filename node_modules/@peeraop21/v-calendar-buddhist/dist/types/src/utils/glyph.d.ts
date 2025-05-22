import { Attribute } from './attribute';
import { DateRangeCell } from './date/range';
export interface Glyph {
    key: string | number;
    color: string;
    class: string | any[];
    style: Record<string, any>;
}
export interface Profile<T> {
    start: T;
    base: T;
    end: T;
    startEnd?: T;
}
export declare type HighlightFillMode = 'solid' | 'light' | 'outline';
export interface Highlight extends Glyph {
    fillMode: HighlightFillMode;
    wrapperClass: string | any[];
    contentClass: string | any[];
    contentStyle: Record<string, any>;
}
export declare type HighlightConfig = boolean | string | Partial<Highlight | Profile<Partial<Highlight>>>;
export declare type Dot = Glyph;
export declare type DotConfig = boolean | string | Partial<Dot | Profile<Partial<Dot>>>;
export declare type Bar = Glyph;
export declare type BarConfig = boolean | string | Partial<Bar | Profile<Partial<Bar>>>;
export declare type Content = Glyph;
export declare type ContentConfig = string | Partial<Content | Profile<Partial<Content>>>;
export interface GlyphRenderer<P extends Partial<Glyph>> {
    type: string;
    normalizeConfig(color: string, config: any): Profile<P>;
    prepareRender(glyphs: Record<string, P[]>): void;
    render(attr: DateRangeCell<Attribute>, glyphs: Record<string, P[]>): void;
}
export declare class HighlightRenderer implements GlyphRenderer<Highlight> {
    type: string;
    normalizeConfig(color: string, config: any): Profile<Highlight>;
    prepareRender(glyphs: Record<string, Glyph[]>): void;
    render({ data, onStart, onEnd }: DateRangeCell<Attribute>, glyphs: Record<string, Highlight[]>): void;
}
export declare class BaseRenderer<T extends Partial<Glyph>> implements GlyphRenderer<T> {
    type: string;
    collectionType: string;
    constructor(type: string, collectionType: string);
    normalizeConfig(color: string, config: any): Profile<T>;
    prepareRender(glyphs: Record<string, T[]>): void;
    render({ data, onStart, onEnd }: DateRangeCell<Attribute>, glyphs: Record<string, T[]>): void;
}
export declare class ContentRenderer extends BaseRenderer<Content> {
    constructor();
    normalizeConfig(_: string, config: any): Profile<Glyph>;
}
export declare class DotRenderer extends BaseRenderer<Dot> {
    constructor();
}
export declare class BarRenderer extends BaseRenderer<Dot> {
    constructor();
}
