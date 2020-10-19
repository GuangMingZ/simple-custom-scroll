/* eslint-disable */
import { useEffect, useRef } from "react";

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
 * import useVerticalScroll from '../hooks/useVerticalScroll'
 * const dom = useRef<>(null)
 * useVerticalScroll(dom.current, ['img1','img2']);
 */

export default function useVerticalScroll(
  containerId: string,
  targetDivIds: string[] = []
) {
  let touchStartX: number = 0,
    touchStartY: number = 0,
    translatePre: any = 0,
    maxMoveTopY: number = 0, // 当前上移最大距离
    maxMoveBottomY: number = 0; // 当前下移最大距离

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
    let clientReact = (target as HTMLHtmlElement).getBoundingClientRect();

    // 最大下位移距离
    maxMoveBottomY = Math.abs(translatePre);

    // 最大上位移距离 = 图片高度 - 容器高度
    maxMoveTopY = clientReact.height - containerHeight.current - maxMoveBottomY;
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
        .split(",")[1]
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
    let move = Math.abs(touchStartY - touchEndY);
    if (
      move > Math.abs(touchStartX - touchEndX) &&
      move > win.innerWidth / 100
    ) {
      if (e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (touchStartY > touchEndY) {
        // 上滑
        move = move > maxMoveTopY ? maxMoveTopY : parseFloat(move.toFixed(2));
        move = parseFloat(translatePre) - move;
        (target as HTMLElement).style.transform = `translate(0px, ${move}px)`;
      } else {
        // 下滑
        move =
          move > maxMoveBottomY ? maxMoveBottomY : parseFloat(move.toFixed(2));
        move = parseFloat(translatePre) + move;
        (target as HTMLElement).style.transform = `translate(0px, ${move}px)`;
      }
    }
  };

  const containerHeight = useRef(0);

  useEffect(() => {
    if (containerId) {
      const $dom = doc.getElementById(containerId);
      containerHeight.current = $dom.clientHeight;

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
