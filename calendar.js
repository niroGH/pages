( function () {

    var component  = {

        name: 'calendar', // texthighlight
        version: [1,0,0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-24.0.1.js',

        config: {
            html: {
                calendar: {
                    class: 'calendar',
                    id: 'calendar-container',
                    inner: [
                        {
                            tag: 'div',
                            class: 'month',
                            inner: [
                                {
                                    tag: 'ul',
                                    inner: [
                                        {
                                            tag: 'li',
                                            class: 'prev',
                                            id: 'prev-btn',
                                            inner: '&#10094;',
                                            onclick: '%prevMonth%'
                                        },
                                        {
                                            tag: 'li',
                                            class: 'next',
                                            id: 'next-btn',
                                            inner: '&#10095;',
                                            onclick: '%nextMonth%'
                                        },
                                        {
                                            tag: 'li',
                                            class: 'month-value',
                                            id: 'month-value'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            tag: 'ul',
                            class: 'weekdays',
                            id: 'weekdays'
                        },
                        {
                            tag: 'ul',
                            class: 'days',
                            id: 'days'
                        }
                    ]
                },
                modal: {
                    id: 'modal',
                    class: 'todo-modal',
                    inner: [
                        {
                            class: 'modal-content',
                            inner: [
                                {
                                    id: 'todo',
                                    class: 'todo-header',
                                    inner:[
                                        {
                                            tag: 'h2',
                                            class: 'title',
                                            id: 'title'
                                        },
                                        {
                                            tag: 'input',
                                            type: 'text',
                                            id: 'todo-text',
                                            placeholder: 'Enter todo...'
                                        },
                                        {
                                            tag: 'span',
                                            class: 'addBtn',
                                            id: 'add-btn',
                                            onclick: '%createTodo%'
                                        }
                                    ]
                                },
                                {
                                    id: 'todo-container',
                                    inner: [
                                        {
                                            tag: 'ul',
                                            id: 'todo-items'
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                }

            },
            css: [ "ccm.load", "https://niroGH.github.io/pages/calendar.css", "https://niroGH.github.io/pages/todo.css" ]
        },

        Instance: function () {

            /**
             * own reference for inner functions
             * @type {Instance}
             */
            const self = this;

            /**
             * shortcut to help functions
             * @type {Object.<string,function>}
             */
            let $;

            /**
             * init is called once after all dependencies are solved and is then deleted
             */
            this.init = async () => {

                // set shortcut to help functions
                $ = this.ccm.helper;

            };

            this.start = async () => {
                const calendar = $.html( self.html.calendar, {
                    nextMonth: (e) => {
                        month++;
                        if(month > 11){
                            month = 0;
                            year++;
                        }
                        span.innerText = year;
                        calendar.querySelector('#month-value').innerHTML = getMonthValue(month) + '<br>' + span.outerHTML;
                        printDaysOfMonth(daysContainer, month, year);
                    },

                    prevMonth: (e) => {
                        month--;
                        if(month < 0){
                            month = 11;
                            year--;
                        }
                        span.innerText = year;
                        calendar.querySelector('#month-value').innerHTML = getMonthValue(month) + '<br>' + span.outerHTML;
                        printDaysOfMonth(daysContainer, month, year);
                    }


                } );


                let month = getCurrentMonth();
                let year = new Date().getFullYear();


                let span = document.createElement('span');
                span.style.fontSize = '18px';
                span.innerText = year;

                calendar.querySelector('#month-value').innerHTML = getMonthValue(month) + '<br>' + span.outerHTML;
                //calendar.querySelector('#year-value').innerText = year;

                const weekdaysContainer = calendar.querySelector('#weekdays');
                const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
                weekdays.forEach(weekday => {
                    let li = document.createElement('li');
                    li.innerText = weekday;
                    weekdaysContainer.appendChild(li);

                });

                const daysContainer = calendar.querySelector('#days');
                printDaysOfMonth(daysContainer, month, year);


                self.element.appendChild(calendar);
                self.element.childNodes[0].style.display = 'none';

                function printDaysOfMonth(dayContainer, month, year) {
                    dayContainer.innerHTML = '';

                    let date = new Date();
                    let currentDay = date.getDate();
                    let isCurrent = false;
                    if(date.getMonth() === month && date.getFullYear() === year){
                        isCurrent = true;
                    }

                    let firstDayOfMonth = new Date(year, month, 1).getDay();
                    for(let i = 1; i < firstDayOfMonth; ++i){
                        let day = document.createElement('li');
                        dayContainer.appendChild(day);
                    }

                    const numberOfDays = new Date(year, month + 1, 0).getDate();
                    for(let i = 0; i < numberOfDays; ++i){
                        let day = document.createElement('li');
                        day.onclick = (e)=> {
                            const key = (i+1) + ' ' + getMonthValue(month) + ' ' + year;
                            const todos = localStorage.getItem(key);
                            const todoItems = todoContainer.querySelector('#todo-items');
                            todoItems.innerHTML = '';
                            if(todos){
                                for(let todo of JSON.parse(todos)){
                                    const li = document.createElement('li');

                                    li.innerText = todo;
                                    const span = document.createElement('span');
                                    span.classList.add('close');
                                    span.innerText = '\u00D7';
                                    li.appendChild(span);

                                    todoItems.appendChild(li);
                                }
                            }

                            modal.querySelector('#date-span').innerHTML = key;
                            modal.style.display = 'block';
                        }
                        const key = (i+1) + ' ' + getMonthValue(month) + ' ' + year;
                        
                        const idParts = key.split(' ');
                        day.id = idParts[1] + idParts[0] + idParts[2];
                        const todos = localStorage.getItem(key);
                        let span = document.createElement('span');
                        span.innerText = (i+1);
                        if(isCurrent && currentDay === (i+1)){
                            span.classList.add('active');
                        }
                        if(todos){
                            span.classList.add('todo-mark');
                        }
                        day.appendChild(span);
                        day.style.cursor = 'pointer';
                        dayContainer.appendChild(day);
                    }
                }

                function getCurrentMonth() {
                    const date = new Date();
                    return date.getMonth();
                }

                function getMonthValue(month) {

                    switch (month) {
                        case 0:
                            return 'Januar';
                        case 1:
                            return 'Februar';
                        case 2:
                            return 'März';
                        case 3:
                            return 'April';
                        case 4:
                            return 'Mai';
                        case 5:
                            return 'Juni';
                        case 6:
                            return 'Juli';
                        case 7:
                            return 'August';
                        case 8:
                            return 'September';
                        case 9:
                            return 'Oktober';
                        case 10:
                            return 'November';
                        case 11:
                            return 'Dezember';
                        default:
                            return 'Januar';
                    }
                }

                //const modal = $.html(self.html.modal);




                const modal = $.html( self.html.modal, {
                    createTodo: (e) => {
                        const li = document.createElement('li');
                        const todoTextInput = modal.querySelector('#todo-text');
                        const value = todoTextInput.value;
                        if(value === ''){
                            return;
                        }
                        li.innerText = value;
                        const span = document.createElement('span');
                        span.classList.add('close');
                        span.innerText = '\u00D7';
                        li.appendChild(span);
                        const todoItems = todoContainer.querySelector('#todo-items');
                        todoItems.appendChild(li);
                        todoTextInput.value = '';
                        const key = modal.querySelector('#date-span').innerText;
                        const list = localStorage.getItem(key);
                        const todos = [];
                        if(list){
                            const todos = JSON.parse(list);
                            todos.push(value);
                            localStorage.setItem(key, JSON.stringify(todos));
                        }else {
                            const  todos = [];
                            todos.push(value);
                            localStorage.setItem(key, JSON.stringify(todos));
                        }
                        const idParts = key.split(' ');
                        const id = idParts[1] + idParts[0] + idParts[2];
                        
                        const day = calendar.querySelector('#' + id);
                        const markSpan = day.querySelector('span');
                        markSpan.classList.add('todo-mark');

                    }
                });
                const todoContainer = modal.querySelector('#todo-container');
                const dateSpan = document.createElement('span');
                dateSpan.id = 'date-span';
                modal.querySelector('#title').innerHTML = 'TODO List' + '<br>' + dateSpan.outerHTML;
                modal.querySelector('#add-btn').innerText = 'Add';

               //self.element.appendChild(todo);
                calendar.appendChild(modal);
                calendar.onclick = function(event) {

                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }



            };

        }

    };

    function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );
