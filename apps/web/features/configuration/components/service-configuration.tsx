"use client"

import { useState } from "react"
import { Search, Save } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ConfigField, type ConfigItem } from "./config-field"
import configData from "@/data/service-configuration.json"

type ConfigData = Record<string, ConfigItem[]>

const data = configData as ConfigData

export function ServiceConfiguration() {
  const [search, setSearch] = useState("")
  const services = Object.keys(data)
  const [activeService, setActiveService] = useState(services[0] ?? "")

  const filteredItems = (items: ConfigItem[]) => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="설정 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button size="sm" className="gap-1.5">
          <Save className="h-3.5 w-3.5" />
          변경사항 저장
        </Button>
      </div>

      {/* service tabs */}
      <Tabs value={activeService} onValueChange={setActiveService}>
        <TabsList className="h-8">
          {services.map((service) => (
            <TabsTrigger key={service} value={service} className="text-sm px-4">
              {service}
            </TabsTrigger>
          ))}
        </TabsList>

        {services.map((service) => {
          const items = filteredItems(data[service] ?? [])
          return (
            <TabsContent key={service} value={service} className="mt-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  검색 결과가 없습니다.
                </p>
              ) : (
                <div className="rounded-lg border bg-card divide-y divide-border">
                  {items.map((item) => (
                    <ConfigField key={item.key} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
