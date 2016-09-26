/**
 * Same concept as Redux middleware
 */


/**
 * Connects different crawler parts into one sequencial flow.
 * Each part much push itself into FlowControl, where part must be a curried function:
 * base => next => data => {// inside logic; next(data)} (like Redux middleware).
 * Each part can require that another part goes after it, this must be provided with static createPart method.
 * Even if part has no requirements it still must pass itself through createPart.
 */
export default class FlowControl {
    constructor(core) {
        this.core = core;
        this.__parts = [];
    }

    static createPart(f, type = '@ANY', requiredNextType = '@ANY') {
        return {
            f,
            partType: type,
            nextPart: requiredNextType
        };
    }

    static __joinParts(functions, core) {
        const withCore = functions.map(part => part.f(core));
        const last = withCore[withCore.length - 1];
        const rest = withCore.slice(0, -1);

        return rest.reduceRight((composed, f) => f(composed), last(core.onFinish))
    }

    static __isPartValid(previousPart, part) {
        return previousPart.nextPart === part.partType;
    }

    push(part) {
        this.__checkPartValidity(part);
        this.__parts.push(part);
    }

    __checkPartValidity(part) {
        const partsCount = this.__parts.length;

        if (partsCount === 0) {
            return;
        }

        const previousPart = this.__parts[partsCount - 1];

        if (!FlowControl.__isPartValid(previousPart, part)) {
            throw Error(`Wrong sequence! Part ${part.partType} should be ${previousPart.nextPart}`)
        }
    }

    start() {
        const joinedParts = FlowControl.__joinParts(this.__parts, this.core);
        joinedParts(null);
    }

}
