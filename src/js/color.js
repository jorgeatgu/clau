function wesPalette() {
    const bg = [
        '#E3CED3',
        '#DDAF5F',
        '#FDE6A7',
        '#EBD1CB',
        '#F5E65C',
        '#DED8A5',
        '#DADBDD',
        '#AAD8C8',
        '#FB656A'
    ];
    const chart = [
        '#9C302C',
        '#370736',
        '#313366',
        '#9D2C5D',
        '#111',
        '#ae1044',
        '#213835',
        '#CF6B57',
        '#5A1B1A'
    ];

    function changeColor(colorico) {
        document.documentElement.style.setProperty(
            '--element-chart',
            chart[colorico]
        );
        document.documentElement.style.setProperty('--bg', bg[colorico]);
    }

    const buttons = document.querySelectorAll('.button-color');
    let i = 0;
    for (i; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            const valor = this.value;
            changeColor(valor);
        });
    }
}

export default wesPalette;
