'use client'

import { ReactNode, useState } from 'react'
import CommonDialog from '@/components/layout/models/common/CommonDialog'
import { useFavoriteGetFolderList, WatchLaterIds } from '@/features'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib'
import FavoriteAddModel from '@/components/layout/models/favorite-add-model/FavoriteAddModel'
import WatchLaterFilterBtn from '@/features/watch-later/components/WatchLaterFilterBtn'

const WatchLaterFavoriteFolderDialog = ({
  handleConfirm,
  svg,
  title,
  ids,
}: {
  handleConfirm: (folder: string | void) => Promise<void>
  svg: ReactNode
  title: string
  ids: WatchLaterIds
}) => {
  const { favoriteFolderList } = useFavoriteGetFolderList()

  const [folderId, setFolderId] = useState<string | undefined>(undefined)

  return (
    <CommonDialog
      trigger={
        <WatchLaterFilterBtn
          label={`${title}到`}
          disabled={!ids.length}
          svg={svg}
          isExpend={true}
        />
      }
      title={`将${ids.length}个视频${title}至`}
      handleConfirm={() => handleConfirm(folderId)}
    >
      <div className={'text-text1 mt-2 mb-6 pt-5 text-left text-sm'}>
        <div className={'h-80 overflow-y-auto'}>
          <FavoriteAddModel>
            <div
              className={
                'border-line_bold hover:border-brand_pink hover:text-brand_pink mb-3 flex h-[52px] cursor-pointer items-center rounded-[4px] border border-dashed p-4 text-sm transition-all duration-300'
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                width='20'
                height='20'
                className={'mr-2'}
              >
                <path
                  d='M9.998375 2.916666666666667C10.343541666666667 2.916666666666667 10.623375 3.1964916666666667 10.623375 3.541666666666667L10.623375 9.374833333333335L16.458333333333336 9.374833333333335C16.803500000000003 9.374833333333335 17.083333333333336 9.654625 17.083333333333336 9.999833333333335C17.083333333333336 10.345 16.803500000000003 10.624833333333335 16.458333333333336 10.624833333333335L10.623375 10.624833333333335L10.623375 16.458333333333336C10.623375 16.803500000000003 10.343541666666667 17.083333333333336 9.998375 17.083333333333336C9.653166666666667 17.083333333333336 9.373375 16.803500000000003 9.373375 16.458333333333336L9.373375 10.624833333333335L3.541666666666667 10.624833333333335C3.1964916666666667 10.624833333333335 2.916666666666667 10.345 2.916666666666667 9.999833333333335C2.916666666666667 9.654625 3.1964916666666667 9.374833333333335 3.541666666666667 9.374833333333335L9.373375 9.374833333333335L9.373375 3.541666666666667C9.373375 3.1964916666666667 9.653166666666667 2.916666666666667 9.998375 2.916666666666667z'
                  fill='currentColor'
                ></path>
              </svg>
              <div>新建文件夹</div>
            </div>
          </FavoriteAddModel>
          <div>
            <RadioGroup value={folderId} onValueChange={(v) => setFolderId(v)}>
              {favoriteFolderList
                ?.filter((item) => item.type !== 'watch_later')
                .map((item) => (
                  <label
                    key={item.id}
                    className={
                      'text-4 group leading-md text-text1 relative flex h-[52px] cursor-pointer items-center pr-0'
                    }
                    onClick={() => setFolderId(item.id)}
                  >
                    <span className={'relative inline-block leading-[1]'}>
                      <RadioGroupItem
                        value={item.id}
                        className={
                          'peer absolute top-0 left-0 -z-1 mt-[3px] mr-[3px] ml-[5px] size-full cursor-pointer opacity-0'
                        }
                      />
                      <span
                        className={cn(
                          'bg-bg1 peer-data-[state=checked]:border-brand_pink group-hover:border-brand_pink border-line_regular relative block size-[14px] rounded-full border leading-[1] transition-all duration-300 ease-in-out'
                        )}
                      >
                        <span
                          className={cn(
                            'border-brand_pink absolute top-0.5 left-0.5 size-2 scale-0 rounded-[4px] border-4 opacity-0 transition-all duration-300 ease-in-out',
                            folderId === item.id && 'scale-100 opacity-100'
                          )}
                        ></span>
                      </span>
                    </span>
                    <span className={'px-smx flex-1 pr-0 select-none'}>
                      <div className={'text-text2 flex'}>
                        <div className={'flex flex-1 items-center overflow-hidden pl-1 text-sm'}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            width='20'
                            height='20'
                          >
                            <path
                              d='M11.125 3.75C11.125 3.3357900000000003 11.460783333333334 3 11.875 3L16.041666666666668 3C16.455883333333336 3 16.791666666666668 3.3357900000000003 16.791666666666668 3.75C16.791666666666668 4.164210000000001 16.455883333333336 4.500000000000001 16.041666666666668 4.500000000000001L11.875 4.500000000000001C11.460783333333334 4.500000000000001 11.125 4.164210000000001 11.125 3.75z'
                              fill='currentColor'
                            ></path>
                            <path
                              d='M6.859044999999999 2.8351083333333333C7.743525 2.7915033333333334 8.587216666666666 3.1748400000000006 9.146400000000002 3.8459L10.076400000000001 4.961925000000001C10.250716666666667 5.1710883333333335 10.508333333333333 5.2917499999999995 10.780166666666666 5.2917499999999995L14.944916666666668 5.2917499999999995C16.658466666666666 5.2917499999999995 18.14481666666667 6.557035 18.299066666666665 8.308036666666666C18.38436666666667 9.276566666666668 18.458333333333332 10.43585 18.458333333333332 11.549583333333334C18.458333333333332 12.580483333333333 18.39495 13.501616666666667 18.31695 14.245550000000001C18.158233333333335 15.7582 16.939466666666668 16.856733333333334 15.470083333333333 16.9792C14.142483333333335 17.0898 12.217433333333334 17.206416666666666 10 17.206416666666666C7.8563833333333335 17.206416666666666 5.986045 17.097383333333337 4.664603333333334 16.990266666666667C3.1067016666666665 16.863916666666668 1.8712733333333336 15.658050000000001 1.7305250000000003 14.092450000000001C1.63291 13.006666666666668 1.5416666666666667 11.57165 1.5416666666666667 9.998083333333334C1.5416666666666667 8.45345 1.6295833333333334 7.042395000000001 1.7251233333333336 5.964178333333334C1.8670950000000002 4.361955000000001 3.146196666666667 3.1454166666666667 4.713206666666666 2.9926150000000002C5.400385 2.9256066666666665 6.02649 2.876151666666667 6.859044999999999 2.8351083333333333zM7.994066666666666 4.8061750000000005C7.728701666666668 4.48773 7.334908333333334 4.3134716666666675 6.932905 4.333283333333333C6.12681 4.373023333333333 5.524751666666667 4.4205966666666665 4.858779999999999 4.485535C3.975881666666667 4.571625 3.2945599999999997 5.246886666666667 3.2192683333333334 6.09658C3.126575 7.142655000000001 3.0416666666666665 8.5082 3.0416666666666665 9.998083333333334C3.0416666666666665 11.516 3.129798333333333 12.90475 3.224495 13.958133333333336C3.299071666666667 14.787616666666667 3.9468516666666664 15.427150000000001 4.785841666666667 15.495149999999999C6.076721666666667 15.599850000000002 7.9055833333333325 15.706416666666668 10 15.706416666666668C12.16665 15.706416666666668 14.049016666666665 15.592350000000001 15.345583333333334 15.484366666666668C16.143716666666666 15.41785 16.746433333333336 14.839383333333334 16.825133333333333 14.089033333333333C16.898633333333333 13.388216666666668 16.958333333333336 12.51995 16.958333333333336 11.549583333333334C16.958333333333336 10.496066666666666 16.888033333333336 9.384266666666667 16.804833333333335 8.439683333333335C16.72266666666667 7.506723333333333 15.9257 6.79175 14.944916666666668 6.79175L10.780166666666666 6.79175C10.062683333333334 6.79175 9.383116666666668 6.473003333333334 8.9241 5.9222L7.994066666666666 4.8061750000000005z'
                              fill='currentColor'
                            ></path>
                          </svg>
                          <div className={'text-text1 ml-2'}>{item.name}</div>
                        </div>

                        <div className={'w-[30px] shrink-0 text-right text-sm'}>{item.number}</div>
                      </div>
                    </span>
                  </label>
                ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </CommonDialog>
  )
}

export default WatchLaterFavoriteFolderDialog
