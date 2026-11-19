# Flow Pick Tablet

태블릿으로 하천과 수로의 표면유속을 측정하는 앱을 소개하는 한·영 홍보 페이지입니다. 웹 데모의 벡터 길이와 수치에는 같은 예시 유속 값을 사용합니다.

## 로컬 실행

설치나 빌드 없이 `index.html`을 브라우저에서 열면 됩니다. Python 3가 있는 환경에서는 프로젝트 폴더에서 다음 명령으로 HTTP를 통해 확인할 수도 있습니다.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)을 엽니다.

## Vercel 배포

Vercel의 **Add New → Project**에서 GitHub 저장소를 가져옵니다. **Framework Preset**은 **Other**, **Root Directory**는 저장소 루트를 선택하고, **Build Command**는 비워 둡니다. Vercel이 루트의 `index.html`과 정적 자산을 그대로 제공합니다. [Vercel 정적 사이트 배포 설정](https://vercel.com/docs/builds/configure-a-build#skip-build-step)

## GitHub Pages 배포

1. `index.html`, `styles.css`, `content.js`, `app.js`, `assets/`를 배포할 저장소의 기본 브랜치에 올립니다.
2. 저장소 **Settings → Pages**에서 **Deploy from a branch**를 선택합니다.
3. 파일을 올린 브랜치와 `/ (root)`를 선택한 뒤 저장합니다.
4. 게시가 완료되면 Pages 주소를 열어 한·영 전환, 이미지, 기준선 데모를 확인합니다.

별도의 빌드 명령이나 환경 변수는 필요 없습니다. 페이지 안의 파일 참조는 상대 경로를 사용합니다. 회사 홈페이지에 직접 반영할 때는 이 파일들을 원하는 하위 경로에 올릴 수 있습니다. SNS와 Google Play 등록정보에 공유할 때는 게시된 페이지의 공개 HTTPS 주소를 사용합니다.

## 내용과 이미지 교체

| 항목 | 수정 위치 |
| --- | --- |
| 영어·한국어 문구와 이미지 설명 | `content.js`의 `translations.en`, `translations.ko`. 스크립트 실행 전 표시되는 기본 영문은 `index.html`에서도 수정할 수 있습니다. |
| 이미지 | `assets/images/`의 파일을 교체하거나 `content.js`의 `images` 경로와 `index.html`의 기본 `src`를 함께 수정합니다. |
| 배경 교체 시 벡터 위치 | `app.js`의 `referenceLines`와 `arrowStarts`를 조정합니다. SVG 좌표는 가로 1000, 세로 562.5 기준입니다. |
| 색상·글꼴 | `styles.css` 맨 위의 CSS 변수 |
| 마지막 CTA | `content.js`의 `closingUrl`, 양쪽 언어의 `closingCta`, `index.html`의 기본 링크 |

하천 배경과 현장·활용 사례 사진은 내장 이미지 생성 도구로 만든 임시 자산입니다. 태블릿 프레임은 CSS로 그렸습니다. 페이지에서 사용하는 이미지와 생성 요청을 아래에 정리했습니다.

| 이미지 | 생성 요청 |
| --- | --- |
| `assets/images/river-demo.jpg` | 부드러운 자연광 아래 위에서 내려다본 하천. 물은 왼쪽에서 오른쪽으로 흐르고, 여러 가로선을 표시할 수 있도록 중앙에 넓은 수면을 확보. 가장자리는 돌과 식생으로 구성. 문자와 그래픽 없이 배경만. |
| `assets/images/river-field.jpg` | 건조한 자갈 둔치에서 태블릿을 든 현장 조사자의 뒷모습. 얕은 청록색 하천과 계곡이 화면 대부분을 차지하는 흐린 아침의 가로형 사진. |
| `assets/images/river-study.jpg` | 얕은 하천 옆 마른 자갈밭에서 두 대학생이 클립보드와 태블릿을 들고 관찰 기록을 비교하는 자연광 야외 사진. |
| `assets/images/river-curiosity.jpg` | 건조한 산책길에서 걸음을 멈추고 돌 사이를 흐르는 개울을 내려다보는 사람을 뒤쪽에서 담은 가로형 사진. |

오프닝에 등장하는 `assets/images/leonardo-studies-of-water.jpg`는 레오나르도 다빈치의 〈물의 연구〉 복제 이미지입니다. 사이트의 파일은 SHA-1 해시를 대조해 [위키미디어 공용의 퍼블릭 도메인 표시 파일](https://commons.wikimedia.org/wiki/File:Leonardo_da_vinci,_Studies_of_water.jpg)과 동일한 것을 확인했습니다. 작품 연대는 [왕실 컬렉션의 작품 설명](https://www.rct.uk/collection/912660/studies-of-water)을 따릅니다.
