export function constrain(val: number, low: number, high: number) {
    if (val < low) return low;
    else if (val > high) return high;
    return val;
}
export function lerp(val: number, low: number, high: number) {
    return (val - low) / (high - low);
}
export function calculateRemainingMinutes(end: Date) {
    const currentDate: Date = new Date();
    console.log(end);
    return Math.trunc((new Date(end).getTime() - currentDate.getTime()) / 60000);
}
