import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { Badge } from "./ui/badge";


export default function ContentItem({item}: {item: {id:number}}) {
    const tags = [{id:1, name:'tag1'},{id:2, name:'tag2'},{id:3, name:'tag3'}
    ]
    if (!item) {
        return <div>No content available</div>;
      }
    
    return (
        <Card className="w-full" key={item.id}>
            <CardContent className="flex h-full p-4">
                <div className="w-[20%] bg-black h-[200px] rounded-xl">Hi</div>
                <div className="flex flex-col justify-between w-full mx-2 w-[80%]">
                    <div id="content-details" className="flex items-start justify-between">
                        <div id="upper-content-details" className="flex flex-col gap-2">
                            <CardTitle>Title</CardTitle>
                            <CardDescription>Description</CardDescription>
                        </div>
                        <button>
                            <PencilSquareIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <div id="tags-list" className="flex w-full flex-wrap overflow-x-auto">
                        {tags.map((item)=> {
                            return <Badge key={item.id} className="px-2 mr-2">{item.name}</Badge>
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}