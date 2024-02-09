// Program to parse natural language input into a structured object representing a Task
// 
// Here, we describe the interface that we will parse
// 
//
// Some keywords that we need to able to parse:
// AT: represents a time a which a task would occur
// for example: "class at 2pm"
//
// FOR: represents a duration of time 
// for example: "class for 1 hour"
//
// ON: represents a date
// for example: "class on monday"
//
// Cal: represents a calendar
// for example: "class on monday cal:work"


// structure to define a task
const Task = {
    name: '',
    time: '',
    duration: '',
    day: '',
    days_from_today: '',
    calendar: '',
}

// function to read input from the user
function readInput() {
    const [node, file, ...args] = process.argv;
    console.log(`args: ${args}`);
    return args.join(' ');
}



// defining the Token structure

const Token_Type = {
    AT: 'AT',
    FOR: 'FOR',
    ON: 'ON',
    CAL: 'CAL',
    WORD: 'WORD',
    DATE: 'DATE',
    TIME: 'TIME',
    DURATION: 'DURATION',
}

const Token = {
    type: Token_Type,
    value: '',
}


// function to parse input into Tokens
function parse_input(input) {
    // convert to lowercase 
    input = input.toLowerCase();

    // split on spaces
    const seq = input.split(' ');

    // create a list of tokens
    const token_list = [];

    // if length of token_list is 0, then the token is a word
    // TODO: this is a hack, need to fix this later
    // add the first word in seq to token_list
    token_list.push({ type: Token_Type.WORD, value: seq.shift() });

    while (seq.length > 0) {
        const token = seq.shift();
        if (token.startsWith('cal:')) {
            token_list.push({ type: Token_Type.CAL, value: token.split(':')[1] });
        }
        else if (token === 'at') {
            token_list.push({ type: Token_Type.AT, value: token });
        } else if (token === 'for') {
            token_list.push({ type: Token_Type.FOR, value: token });
        } else if (token === 'on') {
            token_list.push({ type: Token_Type.ON, value: token });
        } else {

            // if the previous word is ON, then the word represents a date
            // the date can be expressed as a day of the week or <month><day>
            // for example: "monday" or "january1"
            // in the case of a day of the week, find the closest day of the week to today (including today)
            // if the day of the week is today, then the task is today
            if (token_list[token_list.length - 1].type === Token_Type.ON) {
                const day = token;
                const date = process_day(day);
                token_list.push({ type: Token_Type.DATE, value: date });
            }

            // if the previous token is AT, then the current token represents a time
            // the time can be expressed as <hour>:<minute><am/pm>
            // for example: "2:30pm"
            else if (token_list[token_list.length - 1].type === Token_Type.AT) {
                const time = token;
                token_list.push({ type: Token_Type.TIME, value: time });
            }

            // if the previous token is FOR, then the current token represents a duration
            // the duration can be expressed as a <number><hour/minute>
            // for example: "1hour" or "30mins"
            else if (token_list[token_list.length - 1].type === Token_Type.FOR) {
                const duration = process_duration(token);
                token_list.push({ type: Token_Type.DURATION, value: duration });
            }

            else {
                // if none of the above match, then the token is a word
                token_list.push({ type: Token_Type.WORD, value: token });

            }
        }
    }
    return token_list;
}


function process_day(day) {
    // given input like "monday", "tuesday", etc
    // or "march1", "april2", etc
    // return the date 

    // get the current date
    const today = new Date();

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // if the input is a day of the week
    // find the closest day of the week to today (including today)
    // if the day of the week is today, then the task is today
    if (days.includes(day)) {
        const day_index = days.indexOf(day);
        const today_index = today.getDay();
        const days_from_today = (day_index - today_index + 7) % 7;
        // form the date
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days_from_today);
        return date;
    }

    // if the input is a date
    // return the date
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'november', 'december'];
    const month_short_form = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec'];
    const month = day.match(/([a-zA-Z]+)/)[0];
    const day_number = day.match(/([0-9]+)/)[0];
    const month_index = months.indexOf(month) || month_short_form.indexOf(month);
    const year = today.getFullYear();
    return new Date(year, month_index, day_number);

}


function process_duration(duration) {
    // duration can be passed in the form of <number><hour/minute>
    // for example: "1hour" or "30mins"
    // return the duration in minutes

    const hour_units = ['hr', 'hour', 'hours', 'hrs'];
    const minute_units = ['min', 'minute', 'minutes', 'mins'];

    const number = duration.match(/([0-9]+)/)[0];
    const unit = duration.match(/([a-zA-Z]+)/)[0];

    if (hour_units.includes(unit)) {
        return number * 60;
    }
    if (minute_units.includes(unit)) {
        return number;
    }

    return 0;
}

function test_parse_input() {
    var input = "class at 2pm for 1hr on monday cal:work";
    var tokens = parse_input(input);
    console.log(`input: ${input}`);
    console.log(`tokens: ${JSON.stringify(tokens)}`);
    console.log();


    input = "meeting on march3 at 3pm for 30mins cal:work";
    tokens = parse_input(input);
    console.log(`input: ${input}`);
    console.log(`tokens: ${JSON.stringify(tokens)}`);
    console.log();

}

