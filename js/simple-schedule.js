'use strict';

const schedule = (selector, opt = {}) => {
    const topOffsetPx = 25;
    const $scheduleDiv = $(selector);
    const scheduleInfo = opt.schedule_info;
    const drawGrid = (step, dashStep, labels) => {
        const width = $scheduleDiv.width();
        const height = $scheduleDiv.height() - topOffsetPx;
        for (let x = 0, lineCount = 0; x < width; x += step, lineCount++) {
            const gridCss = {left: x, top: `${topOffsetPx}px`, width: 1, height:height, border: '0.5px gray solid', position: 'absolute', 'z-index': 0};
            const $gridDiv = $('<div />').appendTo($scheduleDiv);
            $gridDiv.css(gridCss);
            if (lineCount % dashStep !== 0) {
                $gridDiv.css('border-style', 'dashed');
            } else {
                const dateCss = {left: x, top: 0, position: 'absolute', 'z-index': 0, color: 'red'};
                const $dateDiv = $('<div />').appendTo($scheduleDiv);
                $dateDiv.css(dateCss);
                $dateDiv.text(labels.shift());
            }
        }
    };
    if (scheduleInfo !== undefined) {
        const dateCursor = new Date(opt.period_from);
        const dateTo = new Date(opt.period_to);
        const dateLabels = [];
        while (dateCursor <= dateTo) {
            dateLabels.push(`${dateCursor.getMonth()+1}/${dateCursor.getDate()}`);
            dateCursor.setDate(dateCursor.getDate() + 1);
        }
        const hourWidth = ($scheduleDiv.width()/dateLabels.length)/24;
        $(scheduleInfo).each(function (idx, elm) {
            const left = Math.floor((new Date(elm.start_date).getTime() - new Date(opt.period_from).getTime()) / (1000 * 3600)) * hourWidth;
            const width = Math.floor((new Date(elm.end_date).getTime() - new Date(elm.start_date).getTime()) / (1000 * 3600)) * hourWidth;
            const rowGap = 50;
            const rowCss = {left: 0, top: `${topOffsetPx+idx*rowGap}px`, width: '100%', height: '30px', position: 'absolute', 'z-index': 1};
            const $rowDiv = $(`<div id="period_${elm.id}"/>`).appendTo($scheduleDiv);
            $rowDiv.css(rowCss);
            const $titleDiv = $('<div />').appendTo($rowDiv);
            const titleCss = {left: left, position: 'relative'};
            $titleDiv.css(titleCss);
            $titleDiv.text(`${elm.status} ${elm.category} ${elm.id}/${elm.title}`);
            const $barDiv = $('<div />').appendTo($rowDiv);
            const barCss = {background: 'black', left: left, width: width, height: '5px', position: 'relative'};
            $barDiv.css(barCss);
        });
        drawGrid($scheduleDiv.width()/(dateLabels.length * 2), 2, dateLabels);
    }
};
