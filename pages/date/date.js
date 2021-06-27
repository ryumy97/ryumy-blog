import Layout from "../../components/Layout";

export default function date({date}) {
    return (
        <Layout
            title="date"
            date={date}
            link={date}
        >
            list of date sorted posts
        </Layout>
    )
}