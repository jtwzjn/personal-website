CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cover TEXT,
  tags TEXT[] DEFAULT '{}',
  draft BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 栏目（技术 / 日常）：用于博客按栏目筛选，
-- 让面试官可以只看技术内容，日常随笔仍然保留但不占据首屏。
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '技术';

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- 一次性回填：早期以 daily- 命名的随笔文章归入「日常」栏目。
-- 已归类的记录不再匹配，因此重复执行是安全的。
UPDATE posts SET category = '日常' WHERE category = '技术' AND slug LIKE 'daily-%';
