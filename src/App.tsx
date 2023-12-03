import { useState } from "react"
import { Select, SelectOption } from "./Select"

// array of options, labels can be custom, values should not be changed
// массив опций, label может быть пользовательским, value не должны меняться
const options = [
  { label: "first", value: 1 },
  { label: "second", value: 2 },
  { label: "third", value: 3 },
  { label: "fourth", value: 4 },
  { label: "fifth", value: 5 }
]

function App() {
  // states for multi select and single select
  // стейты для мульти и одиночного селекта
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]) // in multi select useState uses array of SelectOption as type with first option || в мульти селекте useState использует массив SelectOption как тип с первой опцией
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]) // in single select useState uses either SelectOption or undefined as type with first option || в одиночном селекте useState использует либо SelectOption, либо undefined как тип с первой опцией

  return <>
    {/* multi select turns on with 'multiple' option, then all options component needs || мульти селект включается параметром 'multiple' и затем передаются все необходимые компоненту парамерты */}
    <Select multiple options={options} value={value1} onChange={o => setValue1(o)} /> 
    <br />
    {/* single select is the same as multi select, but without 'multiple' option, uses all options component needs || одиночный селект - то же самое, что и мульти селект, только без опции 'multiple', передаются все необходимые компоненту параметры */}
    <Select options={options} value={value2} onChange={o => setValue2(o)} />
  </>
}

export default App