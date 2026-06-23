'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Image, Loader2 } from 'lucide-react'

interface PostFormFieldsProps {
  defaultValues?: {
    slug?: string
    title?: string
    description?: string
    content?: string
    cover?: string
    tags?: string
    draft?: boolean
    publishedAt?: string
  }
}

export function PostFormFields({ defaultValues }: PostFormFieldsProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '上传失败')
      }

      const textarea = contentRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const imageMarkdown = `![${file.name}](${data.url})`
        textarea.value =
          textarea.value.substring(0, start) +
          imageMarkdown +
          textarea.value.substring(end)
        textarea.selectionStart = textarea.selectionEnd =
          start + imageMarkdown.length
        textarea.focus()
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues?.title}
            placeholder="文章标题"
            required
            className="bg-background/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">链接标识</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={defaultValues?.slug}
            placeholder="hello-world"
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title="小写字母、数字和连字符"
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">摘要</Label>
        <Input
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          placeholder="简短描述文章内容"
          required
          className="bg-background/50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cover">封面图 URL</Label>
          <Input
            id="cover"
            name="cover"
            defaultValue={defaultValues?.cover}
            placeholder="https://..."
            className="bg-background/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">标签（用逗号分隔）</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={defaultValues?.tags}
            placeholder="Next.js, React, 随笔"
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="publishedAt">发布时间</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={defaultValues?.publishedAt}
            className="bg-background/50"
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="draft"
            name="draft"
            defaultChecked={defaultValues?.draft ?? false}
          />
          <Label htmlFor="draft" className="cursor-pointer">
            存为草稿
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">正文（Markdown）</Label>
          <Label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-4 w-4" aria-hidden="true" />
              </>
            )}
            <span>{uploading ? '上传中...' : '插入图片'}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </Label>
        </div>
        <textarea
          id="content"
          name="content"
          ref={contentRef}
          defaultValue={defaultValues?.content}
          placeholder="使用 Markdown 编写正文..."
          required
          rows={20}
          className="bg-background/50 w-full resize-y rounded-xl border border-input px-4 py-3 text-sm font-mono leading-relaxed outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
        />
      </div>
    </>
  )
}
