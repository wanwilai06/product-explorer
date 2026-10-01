"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchQuerySchema, SORT_FIELDS } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => void;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchQuery>({
        resolver: zodResolver(SearchQuerySchema),
        defaultValues: {
            q: "",
            limit: 10,
            sortBy: "title",
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSearch)}
            noValidate
            style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr auto', // จัดสัดส่วนความกว้างของแต่ละช่อง
                gap: '15px',
                alignItems: 'end',
                background: '#fafafa',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #eaeaea',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '20px'
            }}
        >
            {/* คำค้น */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="q" style={{ fontWeight: '500', fontSize: '14px' }}>คำค้น</label>
                <input
                    id="q"
                    type="text"
                    placeholder="ค้นหาชื่อสินค้า..."
                    {...register("q")}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
                />
                {errors.q && <span style={{ color: 'red', fontSize: '12px' }}>{errors.q.message}</span>}
            </div>

            {/* จำนวนรายการ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="limit" style={{ fontWeight: '500', fontSize: '14px' }}>จำนวนรายการ</label>
                <input
                    id="limit"
                    type="number"
                    min="1"
                    max="30"
                    {...register("limit", { valueAsNumber: true })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
                />
                {errors.limit && <span style={{ color: 'red', fontSize: '12px' }}>{errors.limit.message}</span>}
            </div>

            {/* เรียงตาม */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="sortBy" style={{ fontWeight: '500', fontSize: '14px' }}>เรียงตาม</label>
                <select
                    id="sortBy"
                    {...register("sortBy")}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
                >
                    {SORT_FIELDS.map((field) => (
                        <option key={field} value={field}>
                            {field === 'title' ? 'ชื่อสินค้า' : field === 'price' ? 'ราคา' : 'จำนวนคงเหลือ'}
                        </option>
                    ))}
                </select>
                {errors.sortBy && <span style={{ color: 'red', fontSize: '12px' }}>{errors.sortBy.message}</span>}
            </div>

            {/* ปุ่มค้นหา */}
            <div>
                <button
                    type="submit"
                    style={{
                        padding: '9px 24px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#333',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: '500',
                        height: '38px'
                    }}
                >
                    ค้นหา
                </button>
            </div>
        </form>
    );
}