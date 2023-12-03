import { useEffect, useRef, useState } from 'react'
import styles from './select.module.css' // importing css module styles, to change edit select.module.css

// SelectOption type exports for usage in main App code as type of state
// тип SelectOption для использования в основном коде App как типа стейта
export type SelectOption = {
    label: string
    value: string | number
}

// MultipleSelectProps type for usage in multi select, multiple value is not optional and true as it is multi select
// тип MultipleSelectProps для использования в мульти селекте, значение multiple обязательно и true, так как мульти селект
type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

// SingleSelectProps type for usage in single select, multiple value is optional and false as it is single select
// тип SingleSelectProps для использования в одиночном селекте, значение multiple не обязательно и false, так как одиночный селект
type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({ multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false) // isOpen state for checking if block with option is open || стейт isOpen для проверки, видим ли блок с опциями
    const [highlightedIndex, setHighlightedIndex] = useState(0) // highlightedIndex state for setting highlighted option when choosing it || стейт highlightedIndex для подсветки опции при её выборе
    const containerRef = useRef<HTMLDivElement>(null) // containerRef for keyboard access of selects || containerRef для клавиатурного доступа к селектам

    // clearOptions function to clear options on click of cross button
    // функция clearOptions для очистки опций при нажатии на кнопку с крестиком
    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }

    // selectOption function for selecting option in said block either in multiple or single select
    // функция selectOption для выбора опций в соответствующем блоке в мульти или одиночном селекте
    function selectOption(option: SelectOption) {
        if (multiple) { // if select is multiple checks if value already includes option and filter is out || если мульти селект, то проверяет, если значение уже включает опцию и отфильтровывает её
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else { // else adds it in || иначе добавляет её
                onChange([...value, option])
            }
        } else { // if select is singular and there is not option with a value in select then select it || если селект одиночный и не выбрана опция с некоторым value в поле селекта, то выбирает её
            if (option !== value) onChange(option)
        }
    }

    // isOptionSelected function that checks if option is selected, both in multi and single select
    // функция isOptionSelected, которая проверяет выбрана ли опция в мульти или одиночном селекте
    function isOptionSelected(option: SelectOption) {
        return multiple ? value.includes(option) : option === value
    }

    // useEffect to reset highlighted element index each time block with options is opened
    // useEffect для обнуления индекса подсвеченного элемента при каждом открытии блока с опциями
    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    // useEffect for keyboard accessibility
    // useEffect для клавиатурной доступности
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return // returns if event target is not current ref of select container || возвращается как только цель ивента - не текущий реф контейнера с селектом
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev) // on Enter or Space key click opens block with options || при нажатии на Enter или Space открывает блок с опциями
                    if (isOpen) selectOption(options[highlightedIndex]) // on Enter or Space key click selects option that has been highlighted || при нажатии на Enter или Space выбирает опцию, которая была подсвечена
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) { // checks if block with options was not previously open || проверяет, не был ли до этого открыт блок с опциями
                        setIsOpen(true) // opens block with options on ArrowUp or ArrowDown key click || открывает блок с опциями при нажатии на стрелочку вниз или вверх
                        break
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1) // creates newValue with a value of highlighted index + the offset || создаёт новое значение со значением индекса подсвеченного элемента и смещением
                    if (newValue >= 0 && newValue < options.length) { // checks if newValue is bigger or equals 0 && is less then length of options, then sets highlighted index with newValue || проверяет, если значение newValue больше или равно 0 и не больше ли оно, чем длина options и устанавливает значение индекса подсвеченного элемента на newValue
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false) // closes block with option on Escape key click || закрывает блок с опциями при нажатии на Escape
                    break
            }
        }

        containerRef.current?.addEventListener("keydown", handler) // adds eventListener on keydown with handler() function || добавляет eventListener с функцией handler() на нажатие клавиатуры

        return () => {
            containerRef.current?.removeEventListener("keydown", handler) // removes eventListener after last keydown with handler() function || убирает eventListener после последнего нажатия на клавиатуру с функцией handler()
        }
    }, [isOpen, highlightedIndex, options]) // useEffect fires each time isOpen, highlightedIndex or options value changes || useEffect стартует каждый раз, когда обновляется значение isOpen, highlightedIndex или options

    return (
        <div ref={containerRef} onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(prev => !prev)} tabIndex={0} className={styles.container}>
            <span className={styles.value}>{multiple ? value.map(v => (
                <button key={v.value} onClick={e => {
                    e.stopPropagation()
                    selectOption(v)
                }} className={styles["option-badge"]}>{v.label} <span className={styles["remove-btn"]}>&times;</span></button>
            )) : value?.label}</span>
            <button onClick={e => {
                e.stopPropagation()
                clearOptions()
            }} className={styles["clear-btn"]}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li onClick={e => {
                        e.stopPropagation()
                        selectOption(option)
                        setIsOpen(false)
                    }} onMouseEnter={() => setHighlightedIndex(index)} key={option.value} className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${index === highlightedIndex ? styles.highlighted : ""}`}>{option.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}