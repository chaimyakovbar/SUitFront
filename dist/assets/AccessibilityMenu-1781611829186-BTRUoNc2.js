import{r as n,j as e,aI as v,I as u,aJ as z,aK as I,aL as c}from"./mui-1781611829186-DMqPqIqD.js";import"./vendor-1781611829186-DoC2WAmd.js";const O=()=>{const[d,x]=n.useState(!1),[p,m]=n.useState(16),[s,g]=n.useState(!1),[r,b]=n.useState(!1),[i,h]=n.useState(!1),[a,y]=n.useState(!1);n.useEffect(()=>{const t=[];r&&t.push("invert(100%)"),i&&t.push("grayscale(100%)");const l=t.join(" ")||"none";document.documentElement.style.filter=l},[r,i]);const k=()=>x(!d),f=t=>{const l=Math.max(10,Math.min(28,p+t));m(l),document.documentElement.style.fontSize=`${l}px`},j=()=>{g(!s),document.documentElement.style.backgroundColor=s?"#ffffff":"#000000",document.documentElement.style.color=s?"#000000":"#ffffff"},S=()=>{b(!r)},C=()=>{h(!i)},w=()=>{y(!a),document.querySelectorAll("a").forEach(t=>{t.style.textDecoration=a?"none":"underline",t.style.color=a?"inherit":"yellow"})};return e.jsxs(M,{children:[e.jsx(E,{"aria-label":"Accessibility menu",onClick:k,children:e.jsx(v,{fontSize:"medium"})}),d&&e.jsxs(A,{role:"menu",children:[e.jsxs(o,{role:"menuitem",className:"menu-heading",children:[e.jsx("span",{children:"גודל כתב"}),e.jsxs("div",{className:"controls",children:[e.jsx(u,{size:"small",onClick:()=>f(2),children:e.jsx(z,{fontSize:"small"})}),e.jsx(u,{size:"small",onClick:()=>f(-2),children:e.jsx(I,{fontSize:"small"})})]})]}),e.jsx(o,{role:"menuitem",onClick:j,children:s?"כבה ניגודיות גבוהה":"הפעל ניגודיות גבוהה"}),e.jsx(o,{role:"menuitem",onClick:S,children:r?"כבה ניגודיות הפוכה":"הפעל ניגודיות הפוכה"}),e.jsx(o,{role:"menuitem",onClick:C,children:i?"כבה גווני אפור":"הפעל גווני אפור"}),e.jsx(o,{role:"menuitem",onClick:w,children:a?"כבה הדגשת קישורים":"הפעל הדגשת קישורים"})]})]})},M=c.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`,E=c.button`
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`,A=c.div`
  direction: rtl;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  color: #ffffff;
  min-width: 260px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: menuSlideIn 180ms ease-out;

  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`,o=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.menu-heading {
    cursor: default;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  button.MuiIconButton-root {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    width: 32px;
    height: 32px;
  }
`;export{O as default};
