


var Task = {
    name: "",
    day: "",
    time: "",
    duration: "",
    location: "",
    calendar: "",
    alerts: []
}

function createTask(name, day, time, duration, location, calendar, alerts) {
    var task = Object.create(Task);
    task.name = name;
    task.day = day;
    task.time = time;
    task.duration = duration;
    task.location = location;
    task.calendar = calendar;
    task.alerts = alerts;
    return task;
}

function split_on_whitespace(str) {
    // convert to lower case
    str = str.toLowerCase();
    return str.split(/\s+/);
}

/**
 * iterate through the array
 * if the word matches a pattern,
 * create a token and add it to the tokens array
 * return the tokens array
 * @function tokenize
 * @param {Array<string>} str
 **/
function tokenize(str) {

    var tokens = [];
    while (str.length > 0) {
        var word = str.shift();
        if (patterns.time.test(word)) {
            tokens.push({ type: "time", value: word });
        } else if (patterns.duration.test(word)) {
            tokens.push({ type: "duration", value: word });
        } else if (patterns.day.test(word)) {
            tokens.push({ type: "day", value: word });
        } else if (patterns.at.test(word)) {
            tokens.push({ type: "at", value: word });
        } else if (patterns.from.test(word)) {
            tokens.push({ type: "from", value: word });
        } else if (patterns.to.test(word)) {
            tokens.push({ type: "to", value: word });
        } else if (patterns.calendar.test(word)) {
            // keep only the calendar name in the value property 
            var match = word.match(patterns.calendar);
            tokens.push({ type: "calendar", value: match[1] });
            // if not match, default value is personal 
            if (tokens.length === 0) {
                tokens.push({ type: "calendar", value: "personal" });
            }
        } else {
            tokens.push({ type: "word", value: word });
        }
    }
    return tokens;


}

const patterns = {
    // time: any number with am or pm after it 
    time: /(\d+)(am|pm)/,
    // duration: any number followed by "hour" or "hours"
    duration: /(\d+)(hour|hours)/,
    // day: any day of the week
    day: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/,
    // at
    at: /at/,
    // from 
    from: /from/,
    // to 
    to: /to/,
    // calendar: cal:calendar but keep only the calendar name
    calendar: /cal:(\w+)/
};

function parse(str) {
    var words = split_on_whitespace(str);
    var tokens = tokenize(words);

    return tokens;
}

/**
 * @function process tokens to create task
 * @param {Array<Object>} tokens
 *
 * @returns {Task}
 **/
function process(tokens) {
    var task = createTask("", "", "", "", "", "", []);
    var i = 0;
    while (i < tokens.length) {
        var token = tokens[i];
        if (token.type === "time") {
            task.time = token.value;
        } else if (token.type === "duration") {
            task.duration = token.value;
        } else if (token.type === "day") {
            task.day = token.value;
        } else if (token.type === "at") {
            task.time = tokens[i + 1].value;
            i++;
        } else if (token.type === "from") {
            task.time = tokens[i + 1].value;
            task.time = tokens[i + 3].value;
            i += 3;
        } else if (token.type === "to") {
            task.time = tokens[i - 1].value;
            task.time = tokens[i + 1].value;
            i++;
        } else if (token.type === "calendar") {
            task.calendar = token.value;
        } else {
            task.name += token.value + " ";
        }
        i++;
    }
    return task;
}

function create_task() {
    const str_1 = "meeting at 1pm on Monday for 2hours. cal:personal";
    const str_2 = "2hour meeting at 1pm on Monday";
    const str_3 = "meeting from 1pm to 3pm on Tuesday at the office";

    console.log(str_1);
    console.log(parse(str_1));
    console.log(process(parse(str_1)));
    console.log("\n");
    console.log("\n");

    console.log(str_2);
    console.log(parse(str_2));
    console.log(process(parse(str_2)));
    console.log("\n");
    console.log("\n");
    console.log(str_3);
    console.log(parse(str_3));
    console.log(process(parse(str_3)));
    console.log("\n");
    console.log("\n");



}

create_task();
