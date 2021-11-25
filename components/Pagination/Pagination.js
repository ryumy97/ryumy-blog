import React from 'react'
import Link from 'next/link'

import styles from './Pagination.module.css'
import utilStyles from '../../styles/utilStyles.module.css'

export default function Pagination({ page, pageNumbers, maxPage }) {
    return (
        <div className={styles.pagination}>
            <Link 
                href={{
                    pathname: '/',
                    query: { page: 1 }
                }}
            >
                <span className={`${utilStyles.link} ${page == 1 && utilStyles.disable}`}>{"<<"}</span>
            </Link>
        
            {pageNumbers.map(_ => {
                return (
                    <Link 
                        key={_}
                        href={{
                            pathname: '/',
                            query: { page: _ }
                        }}
                    >
                        {page == _ 
                            ? <span className={utilStyles.currentLink}>
                                {_}
                            </span>
                            : <span className={utilStyles.link}>
                                {_}
                            </span>
                        }
                    </Link>
                )
            })}

            <Link href={{
                pathname: '/',
                query: { page: maxPage }
            }}>      
                <span className={utilStyles.link}>{">>"}</span>
            </Link>
        </div>
    )
}