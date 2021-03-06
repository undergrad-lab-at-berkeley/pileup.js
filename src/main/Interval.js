/**
 * Class representing a closed numeric interval, [start, stop].
 *
 * @flow
 */

//Kavi: This is base file: it is not dependent on any other file.
"use strict";

class Interval {
  start: number;
  stop: number;

  // Represents [start, stop] -- both ends are inclusive.
  // If stop < start, then this is an empty interval.
  constructor(start: number, stop: number) {
    this.start = start;
    this.stop = stop;
  }

  // TODO: make this a getter method & switch to Babel.
  length(): number {
    return Math.max(0, this.stop - this.start + 1); // Kavi: makes sure that
  // length is never negative
}

  // Kavi: this could be a potential source of a bug. It is possible that then
  // other may not be  intersecting at all. we need to use intersects here.
  intersect(other: Interval): Interval {
    return new Interval(Math.max(this.start, other.start),
                        Math.min(this.stop, other.stop));
  }

  intersects(other: Interval): boolean {
    return this.start <= other.stop && other.start <= this.stop;
  }

  contains(value: number): boolean {
    return value >= this.start && value <= this.stop;
  }

  // Kavi: This basically works as a subset.
  containsInterval(other: Interval): boolean {
    return this.contains(other.start) && this.contains(other.stop);
  }

  // Rounds the interval to the nearest multiples of size.
  // Optional minimum parameter determines the lowest
  // possible value for the start of the resulting Interval.
  round(size: number, zeroBased: boolean): Interval {
    var minimum = zeroBased ? 0 : 1;
    var roundDown = x => x - x % size; //Kavi: This acts as a lambda function in python
    var newStart = Math.max(minimum, roundDown(this.start)),
        newStop = roundDown(this.stop + size - 1);

    return new Interval(newStart, newStop);
  }

  clone(): Interval {
    return new Interval(this.start, this.stop);
  }

  /**
   * Is this Interval entirely covered by the union of the ranges?
   * The ranges parameter must be sorted by range.start
   */
  isCoveredBy(ranges: Interval[]): boolean {
    var remaining = this.clone();
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      if (i && r.start < ranges[i - 1].start) {
        throw 'isCoveredBy must be called with sorted ranges';
      }
      if (r.start > remaining.start) {
        return false;  // A position has been missed and there's no going back.
      }
      remaining.start = Math.max(remaining.start, r.stop + 1);
      if (remaining.length() <= 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find the subintervals which are not in `other`.
   * This can yield either zero, one or two Intervals.
   */
  subtract(other: Interval): Interval[] {
    if (!this.intersects(other)) {
      return [this];  // unaffected by this range
    } else if (this.containsInterval(other)) {
      // return the bit before and the bit after
      return [new Interval(this.start, other.start - 1),
              new Interval(other.stop + 1, this.stop)].filter(x => x.length() > 0);
    } else if (other.containsInterval(this)) {
      return [];  // it's been completely obliterated
    } else {
      // it overlaps one end
      if (other.start < this.start) {
        return [new Interval(other.stop + 1, this.stop)];
      } else {
        return [new Interval(this.start, other.start - 1)];
      }
    }
  }

  /**
   * Find the disjoint subintervals not covered by any interval in the list.
   *
   * If comp = interval.complementIntervals(ranges), then this guarantees that:
   * - comp union ranges = interval
   * - a int b = 0 forall a \in comp, b in ranges
   *
   * (The input ranges need not be disjoint.)
   */
  complementIntervals(ranges: Interval[]): Interval[] {
    var comps = [this];
    ranges.forEach(range => {
      var newComps = [];
      comps.forEach(iv => {
        newComps = newComps.concat(iv.subtract(range));
      });
      comps = newComps;
    });
    return comps;
  }

  // Kavi: Should not this have the same issues that we had with the other
  //function?
  static intersectAll(intervals: Array<Interval>): Interval {
    if (!intervals.length) {
      throw new Error('Tried to intersect zero intervals');
    }
    var result = intervals[0].clone();
    intervals.slice(1).forEach(function({start, stop}) {
      result.start = Math.max(start, result.start);
      result.stop = Math.min(stop, result.stop);
    });
    return result;
  }

  // Returns an interval which contains all the given intervals.
  static boundingInterval(intervals: Array<Interval>): Interval {
    if (!intervals.length) {
      throw new Error('Tried to bound zero intervals');
    }
    var result = intervals[0].clone();
    intervals.slice(1).forEach(function({start, stop}) {
      result.start = Math.min(start, result.start);
      result.stop = Math.max(stop, result.stop);
    });
    return result;
  }

  toString(): string {
    return `[${this.start}, ${this.stop}]`;
  }
}

module.exports = Interval;
