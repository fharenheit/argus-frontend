"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@/lib/utils"

export interface ConfigItem {
  name: string
  key: string
  type: "checkbox" | "inputtext" | "textfield" | "radio" | "textarea" | "key-value-description"
  dataType?: string
  multipleSelection?: boolean
  description?: string
  options?: string[]
  values?: string[]
  default?: string | number
  appendable?: boolean
  unit?: string[]
  defaultUnit?: string
  value?: string
}

interface KeyValueRow {
  key: string
  value: string
  description: string
}

interface ConfigFieldProps {
  item: ConfigItem
}

export function ConfigField({ item }: ConfigFieldProps) {
  const [checkedOptions, setCheckedOptions] = useState<string[]>(() => {
    if (item.type === "checkbox") {
      if (item.values) return item.values
      if (item.default) return [String(item.default)]
    }
    return []
  })

  const [inputValues, setInputValues] = useState<string[]>(() => {
    if (item.type === "inputtext") {
      if (item.values) return item.values
      if (item.default !== undefined) return [String(item.default)]
    }
    return [""]
  })

  const [textValue, setTextValue] = useState(() => {
    if (item.type === "textfield") return ""
    return ""
  })
  const [selectedUnit, setSelectedUnit] = useState(item.defaultUnit ?? item.unit?.[0] ?? "")

  const [radioValue, setRadioValue] = useState(
    item.type === "radio" ? (item.default ? String(item.default) : item.options?.[0] ?? "") : ""
  )

  const [textareaValue, setTextareaValue] = useState(item.value ?? "")

  const [kvRows, setKvRows] = useState<KeyValueRow[]>([{ key: "", value: "", description: "" }])

  const toggleCheckbox = (option: string) => {
    if (item.multipleSelection) {
      setCheckedOptions((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      )
    } else {
      setCheckedOptions((prev) => (prev.includes(option) ? [] : [option]))
    }
  }

  const updateInputValue = (index: number, val: string) => {
    setInputValues((prev) => prev.map((v, i) => (i === index ? val : v)))
  }

  const addInputValue = () => setInputValues((prev) => [...prev, ""])

  const removeInputValue = (index: number) => {
    setInputValues((prev) => prev.filter((_, i) => i !== index))
  }

  const addKvRow = () => setKvRows((prev) => [...prev, { key: "", value: "", description: "" }])

  const removeKvRow = (index: number) => {
    setKvRows((prev) => prev.filter((_, i) => i !== index))
  }

  const updateKvRow = (index: number, field: keyof KeyValueRow, val: string) => {
    setKvRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    )
  }

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-x-8 gap-y-1 py-5 border-b last:border-b-0">
      {/* Left: label + description */}
      <div className="flex flex-col gap-1 pr-4">
        <span className="text-sm font-medium leading-snug">{item.name}</span>
        {item.description && (
          <span className="text-xs text-muted-foreground leading-relaxed">{item.description}</span>
        )}
        <span className="text-xs text-muted-foreground font-mono mt-1 opacity-60">{item.key}</span>
      </div>

      {/* Right: input control */}
      <div className="flex flex-col gap-2">
        {/* checkbox */}
        {item.type === "checkbox" && (
          <div className="flex flex-col gap-2">
            {(item.options ?? item.values ?? []).map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox
                  id={`${item.key}-${option}`}
                  checked={checkedOptions.includes(option)}
                  onCheckedChange={() => toggleCheckbox(option)}
                />
                <Label
                  htmlFor={`${item.key}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* inputtext (appendable or single) */}
        {item.type === "inputtext" && (
          <div className="flex flex-col gap-2">
            {inputValues.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={val}
                  onChange={(e) => updateInputValue(idx, e.target.value)}
                  className="h-8 text-sm"
                  placeholder={item.default !== undefined ? String(item.default) : ""}
                />
                {item.appendable && inputValues.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeInputValue(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
            {item.appendable && (
              <Button
                variant="outline"
                size="sm"
                className="w-fit gap-1.5 text-xs h-7"
                onClick={addInputValue}
              >
                <Plus className="h-3 w-3" />
                항목 추가
              </Button>
            )}
          </div>
        )}

        {/* textfield with unit */}
        {item.type === "textfield" && (
          <div className="flex items-center gap-2">
            <Input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="h-8 text-sm w-40"
              placeholder="0"
            />
            {item.unit && item.unit.length > 0 && (
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="h-8 w-24 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {item.unit.map((u) => (
                    <SelectItem key={u} value={u} className="text-sm">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* radio */}
        {item.type === "radio" && (
          <RadioGroup
            value={radioValue}
            onValueChange={setRadioValue}
            className="flex flex-col gap-2"
          >
            {(item.options ?? []).map((option) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem id={`${item.key}-${option}`} value={option} />
                <Label
                  htmlFor={`${item.key}-${option}`}
                  className={cn(
                    "text-sm font-normal cursor-pointer",
                    radioValue === option && "font-medium"
                  )}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* textarea */}
        {item.type === "textarea" && (
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className="text-sm font-mono min-h-[100px] resize-y"
            placeholder=""
          />
        )}

        {/* key-value-description */}
        {item.type === "key-value-description" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs text-muted-foreground font-medium px-1">
              <span>Name</span>
              <span>Value</span>
              <span>Description</span>
              <span className="w-8" />
            </div>
            {kvRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={row.key}
                  onChange={(e) => updateKvRow(idx, "key", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="name"
                />
                <Input
                  value={row.value}
                  onChange={(e) => updateKvRow(idx, "value", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="value"
                />
                <Input
                  value={row.description}
                  onChange={(e) => updateKvRow(idx, "description", e.target.value)}
                  className="h-8 text-sm"
                  placeholder="description"
                />
                {item.appendable && kvRows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeKvRow(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                {!(item.appendable && kvRows.length > 1) && <div className="w-8" />}
              </div>
            ))}
            {item.appendable && (
              <Button
                variant="outline"
                size="sm"
                className="w-fit gap-1.5 text-xs h-7"
                onClick={addKvRow}
              >
                <Plus className="h-3 w-3" />
                행 추가
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
