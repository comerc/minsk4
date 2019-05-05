import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import Button from './Button'

const withStyle = (Self) => styled(Self)`
  border: 1px solid red;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  /* opacity: 0; */
  /* visibility: hidden; */
  transition: opacity 100ms ease;
  /* will-change: opacity, transform; */
  display: none;
  /* transform: ${({ toolbarTop }) => `translate3D(0, ${toolbarTop}px, 0)`}; */
  @media ${({ theme }) => theme.mobile} {
    border: 1px solid green;
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    z-index: 9;
    height: 50px;
    background: #fff;
    box-shadow: 0 -2px 12px rgba(60, 67, 81, 0.18);
    transform: none !important;
  }
  &&.--opened {
    display: block;
    @media ${({ theme }) => theme.mobile} {
      display: flex;
    }
  }
  .content {
    max-width: ${({ theme }) => theme.contentWidth};
    margin: 0 auto;
    position: relative;
    @media ${({ theme }) => theme.mobile} {
      display: flex;
      align-content: center;
      margin: 0;
      padding: 0 10px;
      max-width: calc(100% - 70px);
      overflow-x: auto;
    }
  }
  .plus {
    position: absolute;
    left: -${({ theme }) => theme.toolboxButtonsSize};
    &--hidden {
      display: none;
    }
    @media ${({ theme }) => theme.mobile} {
      display: none !important;
    }
  }
  .plus,
  .toolbox {
    top: 50%;
    transform: translateY(-50%);    
    /* transform: ${({ focusBlockBoundOffset }) =>
      `translate3D(0, calc(${focusBlockBoundOffset}px - 50%), 0)`}; */
  }
  /**
     * Block actions Zone
     * -------------------------
     */
  .actions {
    border: 1px solid orange;
    position: absolute;
    right: 0;
    top: 0px;
    padding-right: 16px;
    opacity: 0;
    visibility: hidden;
    @media ${({ theme }) => theme.mobile} {
      position: static;
      margin-left: auto;
      display: flex;
      align-items: center;
    }
    &--opened {
      opacity: 1;
      visibility: visible;
    }
    &-buttons {
      text-align: right;
    }
  }
  .settings-btn {
    display: inline-block;
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.grayText};
    cursor: pointer;
  }
  /**
   * Styles for Narrow mode
   */
  .editor--narrow .plus { /* TODO: */
    @media ${({ theme }) => theme.notMobile} {
      left: 5px;
    }
  }
  .toolbox {
    /* border: 1px solid blue; */
    position: absolute;
    visibility: hidden;
    transition: opacity 100ms ease;
    /* will-change: opacity; */
    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      li {
        display: inline;
      }
    }
    @media ${({ theme }) => theme.mobile} {
      position: static;
      transform: none !important;
      visibility: visible !important;
      ul {
        align-items: center;
      }
    }
    &--opened {
      opacity: 1;
      visibility: visible;
    }
  }
  .tooltip {
    position: absolute;
    top: 25px;
    padding: 6px 10px;
    border-radius: 5px;
    line-height: 21px;
    opacity: 0;
    background: ${({ theme }) => theme.bgLight};
    box-shadow: 0 10px 12px -9px rgba(26, 39, 54, 0.32), 0 3px 2px -2px rgba(33, 48, 73, 0.05);
    color: #5c6174;
    font-size: 12px;
    text-align: center;
    user-select: none;
    pointer-events: none;
    transition: opacity 150ms ease-in, left 0.1s linear;
    /* will-change: opacity, left; */
    letter-spacing: 0.02em;
    line-height: 1em;
    &-shortcut {
      color: rgba(100, 105, 122, 0.6);
      word-spacing: -2px;
      margin-top: 5px;
    }
    &--shown {
      opacity: 1;
      transition-delay: 0.1s, 0s;
    }
    &::before {
      content: '';
      width: 10px;
      height: 10px;
      position: absolute;
      top: -5px;
      left: 50%;
      margin-left: -5px;
      transform: rotate(-45deg);
      background-color: ${({ theme }) => theme.bgLight};
      z-index: -1;
    }
  }
  /**
   * Styles for Narrow mode
   */
  .editor--narrow .toolbox { /* TODO: */
    @media ${({ theme }) => theme.notMobile} {
      background: #fff;
      z-index: 2;
    }
  }
`

@withStyle
class Toolbar extends React.Component<any> {
  render() {
    const {
      className,
      theme,
      tools,
      isOpenedToolbox,
      isTitle,
      isEmptyParagraph,
      isReadOnly,
      onPlusClick,
      toolbarRef,
      toolboxRef,
      plusRef,
    } = this.props
    return (
      <div
        {...{
          className: classNames(className, {
            '--opened': !isReadOnly,
          }),
          ref: toolbarRef,
        }}
      >
        <div className="content">
          <Button
            {...{
              className: classNames('plus', {
                'plus--hidden': !isEmptyParagraph,
              }),
              theme,
              onClick: onPlusClick,
              externalRef: plusRef,
            }}
          >
            {/* <svg class="icon icon--plus" width="14px" height="14px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#plus"></use></svg> */}
            +
          </Button>
          <div
            className={classNames('toolbox', { 'toolbox--opened': isOpenedToolbox })}
            ref={toolboxRef}
          >
            <ul>
              {tools.map(({ src, alt, onClick }) => (
                <li key={alt}>
                  <Button {...{ theme, onClick }}>{alt}</Button>
                </li>
              ))}
              {/* <li class="toolbox__button" data-tool="header"><svg width="11" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M7.6 8.15H2.25v4.525a1.125 1.125 0 0 1-2.25 0V1.125a1.125 1.125 0 1 1 2.25 0V5.9H7.6V1.125a1.125 1.125 0 0 1 2.25 0v11.55a1.125 1.125 0 0 1-2.25 0V8.15z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="image"><svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150.242V79c0-18.778-15.222-34-34-34H79c-18.778 0-34 15.222-34 34v42.264l67.179-44.192 80.398 71.614 56.686-29.14L291 150.242zm-.345 51.622l-42.3-30.246-56.3 29.884-80.773-66.925L45 174.187V197c0 18.778 15.222 34 34 34h178c17.126 0 31.295-12.663 33.655-29.136zM79 0h178c43.63 0 79 35.37 79 79v118c0 43.63-35.37 79-79 79H79c-43.63 0-79-35.37-79-79V79C0 35.37 35.37 0 79 0z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="list"><svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="linkTool"><svg width="13" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.264 5.266l-1.854 1.854a3.722 3.722 0 0 1-5.256.008L9.416 10.5a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35z" transform="translate(-3.667 -2.7)"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="code"><svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg"> <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z"></path> </svg></li> */}
              {/* <li class="toolbox__button" data-tool="quote"><svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="delimiter"><svg width="19" height="4" viewBox="0 0 19 4" xmlns="http://www.w3.org/2000/svg"><path d="M1.25 0H7a1.25 1.25 0 1 1 0 2.5H1.25a1.25 1.25 0 1 1 0-2.5zM11 0h5.75a1.25 1.25 0 0 1 0 2.5H11A1.25 1.25 0 0 1 11 0z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="table"><svg width="18" height="14"><path d="M2.833 8v1.95a1.7 1.7 0 0 0 1.7 1.7h3.45V8h-5.15zm0-2h5.15V2.35h-3.45a1.7 1.7 0 0 0-1.7 1.7V6zm12.3 2h-5.15v3.65h3.45a1.7 1.7 0 0 0 1.7-1.7V8zm0-2V4.05a1.7 1.7 0 0 0-1.7-1.7h-3.45V6h5.15zM4.533.1h8.9a3.95 3.95 0 0 1 3.95 3.95v5.9a3.95 3.95 0 0 1-3.95 3.95h-8.9a3.95 3.95 0 0 1-3.95-3.95v-5.9A3.95 3.95 0 0 1 4.533.1z"></path></svg></li> */}
              {/* <li class="toolbox__button" data-tool="rawTool"><svg width="19" height="13"><path d="M18.004 5.794c.24.422.18.968-.18 1.328l-4.943 4.943a1.105 1.105 0 1 1-1.562-1.562l4.162-4.162-4.103-4.103A1.125 1.125 0 1 1 12.97.648l4.796 4.796c.104.104.184.223.239.35zm-15.142.547l4.162 4.162a1.105 1.105 0 1 1-1.562 1.562L.519 7.122c-.36-.36-.42-.906-.18-1.328a1.13 1.13 0 0 1 .239-.35L5.374.647a1.125 1.125 0 0 1 1.591 1.591L2.862 6.341z"></path></svg></li> */}
            </ul>
          </div>
          {/* <div class="tooltip" style="left: 288px; transform: translate3d(-50%, 34px, 0px);">Raw HTML</div> */}
        </div>
        <div
          className={classNames('actions', {
            'actions--opened': !isTitle,
          })}
        >
          <div className="actions-buttons">
            <span className="settings-btn">
              ...
              {/* <svg class="icon icon--dots" width="18px" height="4px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#dots"></use></svg> */}
            </span>
          </div>
          {/* <div className="editor-settings">
            <div className="editor-settings__plugin-zone" />
            <div className="editor-settings__default-zone" />
          </div> */}
        </div>
      </div>
    )
  }
}

export default Toolbar
