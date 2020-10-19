/* eslint-disable */
import { useEffect } from "react";

const win = typeof window === "undefined" ? ({} as any) : window;
const doc = typeof window === "undefined" ? ({} as any) : document;

/**
 * 使用transform实现左、右scroll-水平滚动
 * 优点：1.没有滚动条；2.可以兼容各类浏览器；3.可以在某些全屏翻页组件里完美实现内容滚动
 * @param $dom 内部含有需要自定义滚动的img，div的标签的容器元素
 * @param targetDivIds 真正需要滚动的元素
 *
 * @example 容器内有两张图片img1，img2，需要自定义滚动
 *
 * import useCustomScroll from '../hooks/useCustomScroll'
 * const dom = useRef<>(null)
 * useCustomScroll(dom.current, ['img1','img2']);
 */

export default function useCustomScroll(
  containerId: string,
  targetDivIds: string[] = []
) {
  let touchStartX: number = 0,
    touchStartY: number = 0,
    translatePre: any = 0,
    maxMoveLeftX: number = 0, // 当前左移最大距离
    maxMoveRightX: number = 0, // 当前右移最大距离
    isMoveX: boolean = false; // 是否是横向移动

  const touchStartHandle = (e: TouchEvent) => {
    const { target } = e;
    if (target && !targetDivIds.includes((target as HTMLHtmlElement).id)) {
      return;
    }
    touchStartX = e.touches[0].pageX;
    touchStartY = e.touches[0].pageY;
    translatePre = (target as HTMLHtmlElement).getAttribute("data-translate");
    if (!translatePre) {
      (target as HTMLElement).setAttribute("data-translate", "0");
      translatePre = 0;
    }
    isMoveX = false;
    let clientReact = (target as HTMLHtmlElement).getBoundingClientRect();
    // 最大左位移距离 = 图片宽度 - (屏幕宽度 - 左边距)
    maxMoveLeftX = clientReact.width + clientReact.left - win.innerWidth + 1;
    // 最大右位移距离
    maxMoveRightX = Math.abs(translatePre);
  };

  const touchEndHandle = (e: TouchEvent) => {
    const { target } = e;
    if (target && !targetDivIds.includes((target as HTMLHtmlElement).id)) {
      return;
    }
    let transformStr = (target as HTMLElement).style.transform;
    let transformValStr = transformStr.match(/\((.+?)\)/g);
    if (transformValStr) {
      let transformVal = transformValStr[0]
        .replace(/px/g, "")
        .split(",")[0]
        .replace(/[^0-9 | . ｜ -]/gi, "");
      (target as HTMLElement).setAttribute("data-translate", transformVal);
    }
  };

  const touchMoveHandle = (e: any) => {
    if (!e) {
      return;
    }
    const { target } = e;
    if (target && !targetDivIds.includes((target as HTMLHtmlElement).id)) {
      return;
    }
    const touchEndX = e.touches[0].pageX;
    const touchEndY = e.touches[0].pageY;
    let move = Math.abs(touchStartX - touchEndX);
    if (
      move > Math.abs(touchStartY - touchEndY) &&
      move > win.innerWidth / 100
    ) {
      if (e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (touchStartX > touchEndX) {
        // 左滑
        move = move > maxMoveLeftX ? maxMoveLeftX : parseFloat(move.toFixed(2));
        move = parseFloat(translatePre) - move;
        (target as HTMLElement).style.transform = `translate(${move}px, 0px)`;
      } else {
        // 右滑
        move =
          move > maxMoveRightX ? maxMoveRightX : parseFloat(move.toFixed(2));
        move = parseFloat(translatePre) + move;
        (target as HTMLElement).style.transform = `translate(${move}px, 0px)`;
      }
      isMoveX = true;
    }
  };

  useEffect(() => {
    if (containerId) {
      const $dom = doc.getElementById(containerId);

      $dom.addEventListener("touchmove", touchMoveHandle);
      $dom.addEventListener("touchstart", touchStartHandle);
      $dom.addEventListener("touchend", touchEndHandle);
      return () => {
        $dom.removeEventListener("touchmove", touchMoveHandle);
        $dom.removeEventListener("touchstart", touchStartHandle);
        $dom.removeEventListener("touchend", touchEndHandle);
      };
    }
  }, []);
}
