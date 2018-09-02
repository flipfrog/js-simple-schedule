'use strict';

const schedule = (selector, opt = {}) => {
    const $scheduleDiv = $(selector);
    const scheduleInfo = opt.schedule_info;
    const drawGrid = (step, dashStep) => {
        const width = $scheduleDiv.width();
        const height = $scheduleDiv.height();
        for (let x = 0, lineCount = 0; x < width; x += step, lineCount++) {
            const gridCss = {left: x, top: 0, width: 1, height:height, border: '0.5px gray solid', position: 'absolute', 'z-index': 0};
            const $gridDiv = $('<div />').appendTo($scheduleDiv);
            $gridDiv.css(gridCss);
            if (lineCount % dashStep !== 0) {
                $gridDiv.css('border-style', 'dashed');
            }
        }
    };
    if (scheduleInfo !== undefined) {
        $(scheduleInfo).each(function (idx, elm) {
            const rowGap = 50;
            const rowCss = {left: 0, top: idx*rowGap, width: '100%', height: '30px', position: 'absolute', 'z-index': 1};
            const $rowDiv = $(`<div id="period_${elm.id}"/>`).appendTo($scheduleDiv);
            $rowDiv.css(rowCss);
            const $titleDiv = $('<div />').appendTo($rowDiv);
            $titleDiv.text(`OK ${elm.category} ${elm.id}/${elm.title}`);
            const $barDiv = $('<div />').appendTo($rowDiv);
            const barCss = {background: 'black', width: '100px', height: '5px'};
            $barDiv.css(barCss);
        });
        drawGrid(50, 2);
    }
};
