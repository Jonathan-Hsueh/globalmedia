function randomOutput() {
    const options = [true, false];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}
export default randomOutput;