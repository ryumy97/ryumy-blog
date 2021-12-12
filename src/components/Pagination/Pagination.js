import React from 'react'
import { Link } from 'react-router-dom'

import { toSearchParam } from '../../util/params'

import styles from './Pagination.module.css'
import utilStyles from 'styles/utilStyles.module.css'

export default function Pagination({ page, pageNumbers, maxPage }) {
    return (
        <div className={styles.pagination}>
            <Link 
                to={{
                    pathname: '/',
                    search: toSearchParam({ page : 1 })
                }}
                className={`${utilStyles.link} ${page === 1 && utilStyles.disable}`}
            >
                {"<<"}
            </Link>
        
            {pageNumbers.map(_ => {
                return (
                    <Link 
                        key={_}
                        to={{
                            pathname: '/',
                            search: toSearchParam({ page : _ })
                        }}
                        className={page === _ ? utilStyles.currentLink : utilStyles.link}
                    >
                        {_}
                    </Link>
                )
            })}

            <Link
                to={{
                    pathname: '/',
                    search: toSearchParam({ page : maxPage })
                }}
                className={`${utilStyles.link}`}
            >
                {">>"}
            </Link>
        </div>
    )
}