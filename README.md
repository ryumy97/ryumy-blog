# 데이터 표현 100가지 방법 블로그

이 프로젝트는 **데이터를 표현하는 100가지 방법** 아이디어 북을 기반으로,  
프론트엔드 개발자를 위한 데이터 시각화 예제와 인사이트를 공유하는 블로그입니다.  
Next.js와 MDX를 사용하여 문서 기반으로 구성되며, CodeSandbox / CodePen 등의 예제를 직접 임베드할 수 있습니다.

---

## 🚀 목표

- 점, 선, 면 등 **기초적인 시각적 요소**에서 출발하여
- 구조(네트워크, 계층, 분포 등), 맥락(시간, 공간, 흐름 등), 상호작용까지
- **프론트엔드 개발자가 직접 구현 가능한 예제**와 함께 정리합니다.

---

## 🛠 기술 스택

- **Next.js** (App Router)
- **MDX** (Markdown + React Component)
- **Tailwind CSS** (스타일링)
- **Motion** (애니메이션)
- **Lucide React** (아이콘)
- **CodeSandbox / CodePen Embed** (실행 가능한 코드 예제)
- 배포: Vercel

---

## 📖 콘텐츠 작성 규칙

- 모든 포스트는 `content/` 안에 `.mdx` 형식으로 작성
- 구조:
  1. 개념 소개
  2. 시각화 예제 (이미지 or GIF)
  3. 코드 스니펫
  4. CodeSandbox/CodePen embed
  5. 마무리 인사이트
- 카테고리: `Fundamentals`, `Structures`, `Context`, `Interaction`, `Beyond`

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone https://github.com/ryumy97/ryumy-blog.git
   cd ryumy-blog
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

---

## 📁 프로젝트 구조

```
ryumy-blog/
├── content/                    # MDX 블로그 포스트
│   ├── fundamentals/          # 기본 요소 (점, 선, 면)
│   ├── structures/            # 구조적 표현 (네트워크, 계층)
│   ├── context/               # 맥락적 표현 (시간, 공간)
│   ├── interaction/           # 상호작용
│   └── beyond/                # 혁신적 표현
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   ├── posts/             # 포스트 관련 페이지
│   │   └── category/          # 카테고리 페이지
│   ├── components/            # 재사용 가능한 컴포넌트
│   └── lib/                   # 유틸리티 함수
│       └── posts.ts           # 포스트 관리 시스템
├── public/                    # 정적 파일
│   ├── images/                # 이미지 파일
│   └── icons/                 # 아이콘 파일
├── next.config.js             # Next.js 설정
├── tailwind.config.js         # Tailwind CSS 설정
└── package.json               # 프로젝트 의존성
```

---

## 📝 포스트 작성 가이드

### 1. 포스트 생성

새로운 포스트를 작성하려면 해당 카테고리 폴더에 `.mdx` 파일을 생성하세요:

```bash
# 예시: fundamentals 카테고리에 새 포스트 생성
touch content/fundamentals/02-lines.mdx
```

### 2. Frontmatter 작성

각 포스트의 상단에 메타데이터를 작성해야 합니다:

```yaml
---
title: "포스트 제목"
description: "포스트 설명"
date: "2024-01-15"
category: "fundamentals"
tags: ["태그1", "태그2"]
image: "/images/example.jpg"
codesandbox: "example-sandbox-id"
codepen: "example-pen-id"
featured: true
order: 2
---
```

### 3. 콘텐츠 작성

MDX를 사용하여 마크다운과 React 컴포넌트를 함께 사용할 수 있습니다:

````mdx
# 제목

일반적인 마크다운 문법을 사용할 수 있습니다.

## 코드 예제

```jsx
import React from "react";

const Example = () => {
  return <div>Hello World!</div>;
};
```
````

## 커스텀 컴포넌트

<CodeExample language="javascript">
console.log('Hello World!');
</CodeExample>
```

---

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### 카테고리별 색상

- **Fundamentals**: Blue
- **Structures**: Green
- **Context**: Purple
- **Interaction**: Orange
- **Beyond**: Pink

---

## 🔧 개발 가이드

### 새로운 컴포넌트 추가

1. `src/components/` 폴더에 컴포넌트 생성
2. TypeScript 타입 정의
3. Tailwind CSS로 스타일링
4. 필요한 경우 Framer Motion 애니메이션 추가

### 새로운 페이지 추가

1. `src/app/` 폴더에 페이지 생성
2. 라우팅 설정
3. 메타데이터 추가
4. SEO 최적화

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [MDX 공식 문서](https://mdxjs.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [D3.js 공식 문서](https://d3js.org/)
- [Framer Motion 공식 문서](https://www.framer.com/motion/)

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 📞 연락처

- GitHub: [@ryumy97](https://github.com/ryumy97)
- 이슈 리포트: [GitHub Issues](https://github.com/ryumy97/ryumy-blog/issues)

---

## 🙏 감사의 말

이 프로젝트는 다음과 같은 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [D3.js](https://d3js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide](https://lucide.dev/)
